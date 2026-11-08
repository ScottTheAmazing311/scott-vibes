// Glue between Kid Zone's Creature Cauldron and the Procedural Pixel Creatures core.
// The game decides what a recipe means (family, archetype, gene nudges); this file samples the
// genome, optionally crosses two parents, applies the nudges, and renders animated sprite sheets.

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.Json;
using PixelCreatures.Core;
using PixelCreatures.Core.Export;
using PixelCreatures.Core.Genetics;

namespace CreatureLab
{
    public static class Mixer
    {
        private static CreatureRegistry? _registry;
        private static CreatureFactory? _factory;

        private static CreatureRegistry Registry
        {
            get
            {
                if (_registry != null) return _registry;
                _registry = CreatureRegistry.CreateDefault();
                _registry.RegisterExtension(new PixelCreatures.Plantfolk.PlantfolkExtension());
                _factory = new CreatureFactory(_registry, 16);
                return _registry;
            }
        }

        /// <summary>A fresh genome of one archetype, following GenomeFactory.Sample.</summary>
        private static CreatureGenome Sample(ICreatureFamily family, string archetype, ulong seed)
        {
            var schema = family.Schema;
            var values = new double[schema.Count];
            for (int i = 0; i < values.Length; i++) values[i] = schema.Genes[i].Default;
            family.SampleAnatomy(values, Rng.Derive(seed, "genes.anatomy." + family.Id), archetype);
            var hints = family.StyleHints(archetype);
            SharedGenes.SampleColor(schema, values, Rng.Derive(seed, "genes.color"), hints);
            SharedGenes.SamplePattern(schema, values, Rng.Derive(seed, "genes.pattern"), hints);
            SharedGenes.SampleMotion(schema, values, Rng.Derive(seed, "genes.motion"), hints);
            family.AdjustSample(values, Rng.Derive(seed, "genes.adjust." + family.Id), archetype);
            string name = NameGenerator.Generate(Rng.Derive(seed, "name"));
            return new CreatureGenome(schema, CreatureFramework.GeneratorVersion, CreatureGenome.DeriveStreamSeeds(seed), values, name, GenomeLineage.Sampled);
        }

        /// <summary>
        /// recipe: { family, archetype, seed, mate?: { archetype, seed }, genes?: { id: number|string|bool }, nudge?: { id: delta }, clips?: ["idle","action"], dir? }
        /// Returns { name, family, archetype, frameWidth, frameHeight, originX, originY, clips: [{ name, loop, frames: [{ x, y, ms }] }], png (base64) }.
        /// </summary>
        public static string Mix(string recipeJson)
        {
            using var doc = JsonDocument.Parse(recipeJson);
            var r = doc.RootElement;
            var reg = Registry;
            var family = reg.GetFamily(r.GetProperty("family").GetString()!);
            string arch = r.GetProperty("archetype").GetString()!;
            ulong seed = ulong.Parse(r.GetProperty("seed").GetString()!, CultureInfo.InvariantCulture);
            var genome = Sample(family, arch, seed);

            if (r.TryGetProperty("mate", out var mate))
            {
                var other = Sample(family, mate.GetProperty("archetype").GetString()!, ulong.Parse(mate.GetProperty("seed").GetString()!, CultureInfo.InvariantCulture));
                var child = GenomeOps.Cross(genome, other, seed ^ 0x9E3779B97F4A7C15UL, new MutationSettings { Strength = 0.25 }).Child;
                genome = child.WithName(genome.Name);
            }

            if (r.TryGetProperty("genes", out var genes))
            {
                foreach (var g in genes.EnumerateObject())
                {
                    if (genome.Schema.IndexOf(g.Name) < 0) continue;
                    var def = genome.Schema.Get(g.Name);
                    switch (g.Value.ValueKind)
                    {
                        case JsonValueKind.Number:
                            genome = genome.With(g.Name, Math.Clamp(g.Value.GetDouble(), def.Min, def.Max));
                            break;
                        case JsonValueKind.True:
                        case JsonValueKind.False:
                            genome = genome.With(g.Name, g.Value.GetBoolean() ? 1 : 0);
                            break;
                        case JsonValueKind.String:
                            if (def.OptionIndex(g.Value.GetString()!) >= 0) genome = genome.WithChoice(g.Name, g.Value.GetString()!);
                            break;
                    }
                }
            }

            // nudges add to whatever the sample rolled, so a Giant Bean makes this creature bigger
            if (r.TryGetProperty("nudge", out var nudge))
            {
                foreach (var g in nudge.EnumerateObject())
                {
                    if (genome.Schema.IndexOf(g.Name) < 0 || g.Value.ValueKind != JsonValueKind.Number) continue;
                    var def = genome.Schema.Get(g.Name);
                    genome = genome.With(g.Name, Math.Clamp(genome.Get(g.Name) + g.Value.GetDouble(), def.Min, def.Max));
                }
            }

            var model = _factory!.Build(genome);
            var opt = new SpritesheetOptions { Fps = 12, Padding = 1, DrawShadow = true };
            opt.Clips.Clear();
            var clipNames = new List<string>();
            if (r.TryGetProperty("clips", out var clips))
                foreach (var c in clips.EnumerateArray()) clipNames.Add(c.GetString()!);
            else clipNames.Add("idle");
            foreach (var c in clipNames) opt.Clips.Add(ParseClip(c));
            opt.Directions.Clear();
            opt.Directions.Add(r.TryGetProperty("dir", out var d) ? d.GetInt32() : 7);

            var sheet = SpritesheetExporter.Export(model, reg, opt, "creature");
            var page = sheet.Pages[0];
            byte[] png = PngEncoder.Encode(page.rgba, page.width, page.height);

            using var ms = new System.IO.MemoryStream();
            using (var w = new Utf8JsonWriter(ms))
            {
                w.WriteStartObject();
                w.WriteString("name", genome.Name);
                w.WriteString("family", family.Id);
                w.WriteString("archetype", arch);
                w.WriteNumber("frameWidth", sheet.FrameWidth);
                w.WriteNumber("frameHeight", sheet.FrameHeight);
                w.WriteNumber("originX", sheet.OriginX);
                w.WriteNumber("originY", sheet.OriginY);
                w.WriteStartArray("clips");
                foreach (var c in sheet.Clips)
                {
                    w.WriteStartObject();
                    w.WriteString("name", c.Name);
                    w.WriteBoolean("loop", c.Loop);
                    w.WriteStartArray("frames");
                    foreach (var f in c.Frames)
                    {
                        w.WriteStartArray();
                        w.WriteNumberValue(f.X);
                        w.WriteNumberValue(f.Y);
                        w.WriteNumberValue(f.DurationMs);
                        w.WriteEndArray();
                    }
                    w.WriteEndArray();
                    w.WriteEndObject();
                }
                w.WriteEndArray();
                w.WriteString("png", Convert.ToBase64String(png));
                w.WriteEndObject();
            }
            return System.Text.Encoding.UTF8.GetString(ms.ToArray());
        }

        private static ClipKind ParseClip(string s) => s switch
        {
            "walk" => ClipKind.Walk,
            "run" => ClipKind.Run,
            "action" => ClipKind.Action,
            "hit" => ClipKind.Hit,
            "sleep" => ClipKind.Sleep,
            _ => ClipKind.Idle,
        };

        /// <summary>Families and their archetypes, for the game's ingredient table.</summary>
        public static string Catalog()
        {
            using var ms = new System.IO.MemoryStream();
            using (var w = new Utf8JsonWriter(ms))
            {
                w.WriteStartArray();
                foreach (var f in Registry.Families)
                {
                    w.WriteStartObject();
                    w.WriteString("id", f.Id);
                    w.WriteString("name", f.DisplayName);
                    w.WriteStartArray("archetypes");
                    foreach (var a in f.Archetypes) w.WriteStringValue(a.Id);
                    w.WriteEndArray();
                    w.WriteEndObject();
                }
                w.WriteEndArray();
            }
            return System.Text.Encoding.UTF8.GetString(ms.ToArray());
        }
    }
}
