// Creature Cauldron: ingredients and how a pot of them becomes a creature recipe.
// Creatures come from Procedural Pixel Creatures (MIT, github.com/idlerunner00/procedural-pixel-creatures),
// compiled to WebAssembly in /public/kidzone/cauldron. A recipe names a family and archetype from that
// generator, a seed, and gene changes; the generator does the rest.

export type GeneValue = number | string | boolean;

export interface Recipe {
  family: string;
  archetype: string;
  seed: string;
  /** a second parent of the same family, crossed with the generator's own breeding */
  mate?: { archetype: string; seed: string };
  genes: Record<string, GeneValue>;
  nudge: Record<string, number>;
  clips: string[];
  dir: number;
}

export interface Ingredient {
  id: string;
  name: string;
  kind: "body" | "magic";
  /** 12×12 pixel art; each character is a key in `palette`, "." is empty */
  art: string[];
  palette: Record<string, string>;
  /** body ingredients pick the creature */
  body?: { family: string; archetypes: string[]; hue: number; material?: string; pattern?: string };
  /** magic ingredients change its genes */
  magic?: Magic;
  /** pot color it adds, as an OKLCH-ish hue for the brew */
  brew: string;
}

interface Magic {
  hue?: number;
  saturation?: number;
  value?: number;
  glow?: number;
  genes?: Record<string, GeneValue>;
  size?: number;
  rainbow?: boolean;
}

const fill = (rows: string[]) => (rows.length < 12 ? [...rows, ...Array(12 - rows.length).fill("............")] : rows);

export const INGREDIENTS: Ingredient[] = [
  {
    id: "dragon-scale",
    name: "Dragon Scale",
    kind: "body",
    brew: "#d9583a",
    body: { family: "reptile", archetypes: ["dragon", "dragon", "drake", "lizard", "crocodile", "tortoise", "salamander"], hue: 28, material: "scales" },
    palette: { k: "#5a1a14", r: "#c8412f", o: "#e8703f", y: "#f6c36a" },
    art: fill([
      "....kkkk....",
      "..kkrrrrkk..",
      ".krrooorrrk.",
      ".kroyyoorrk.",
      "krroyoorrrrk",
      "krrooorrrrrk",
      "krrrrrrrrrrk",
      ".krrrrrrrrk.",
      ".kkrrrrrrkk.",
      "..kkrrrrkk..",
      "....kkkk....",
    ]),
  },
  {
    id: "owl-feather",
    name: "Owl Feather",
    kind: "body",
    brew: "#b08354",
    body: { family: "winged", archetypes: ["owl", "raptor", "songbird"], hue: 55, material: "feather" },
    palette: { k: "#4a2e1c", b: "#8a5a34", t: "#c99a63", w: "#f0dcb4" },
    art: fill([
      ".........kk.",
      "........kbtk",
      ".......kbtwk",
      "......kbtwk.",
      ".....kbbtk..",
      "....kbbtk...",
      "...kbbtk....",
      "..kbbtk.....",
      "..kbtk......",
      ".k.kk.......",
      "k...........",
    ]),
  },
  {
    id: "bat-wing",
    name: "Bat Wing",
    kind: "body",
    brew: "#7a6a9a",
    body: { family: "winged", archetypes: ["bat", "moth", "dragonfly"], hue: 290, material: "hide" },
    palette: { k: "#2a2238", p: "#6a5a8a", l: "#9a88b8" },
    art: fill([
      "............",
      "k..........k",
      "kk........kk",
      "kpk..kk..kpk",
      "kppkkllkkppk",
      "kpppllllpppk",
      "kppllllllppk",
      ".kpllkklllk.",
      ".kplk..klpk.",
      "..kk....kk..",
    ]),
  },
  {
    id: "fish-fin",
    name: "Fish Fin",
    kind: "body",
    brew: "#3a9faa",
    body: { family: "aquatic", archetypes: ["reef", "reef", "puffer", "shark", "ray", "angler", "eel"], hue: 195, material: "scales" },
    palette: { k: "#143c4a", t: "#2f8f9a", a: "#6fd0c8", w: "#c8f2ec" },
    art: fill([
      "............",
      ".k..........",
      ".kk.........",
      ".kak........",
      ".kaak..k....",
      ".kataakak...",
      ".kattaatak..",
      ".kttttttaak.",
      ".ktttttttwk.",
      ".kkkkkkkkkk.",
    ]),
  },
  {
    id: "beetle-shell",
    name: "Beetle Shell",
    kind: "body",
    brew: "#3f9a4a",
    body: { family: "arthropod", archetypes: ["beetle", "ant", "mantis", "spider", "scorpion", "crab"], hue: 135, material: "chitin" },
    palette: { k: "#10301c", g: "#2f7a3a", e: "#4fb05a", s: "#a8e6a0" },
    art: fill([
      "...kkkkkk...",
      "..kggkkggk..",
      ".ksegkkgeggk",
      ".ksggkkggggk",
      "kseggkkgggek",
      "kgeggkkgggek",
      "kggggkkggggk",
      "kggggkkggggk",
      ".kgggkkgggk.",
      "..kggkkggk..",
      "...kkkkkk...",
    ]),
  },
  {
    id: "slime-drop",
    name: "Slime Drop",
    kind: "body",
    brew: "#5cc85a",
    body: { family: "amorphous", archetypes: ["slime", "slime", "ooze", "jelly", "wisp", "octopus", "beholder"], hue: 140, material: "slime" },
    palette: { k: "#1d5a2a", g: "#4cc25a", l: "#a6f0a0", w: "#ffffff" },
    art: fill([
      ".....kk.....",
      "....kggk....",
      "....kggk....",
      "...kggggk...",
      "..kgwlgggk..",
      "..kgwlgggk..",
      ".kggllggggk.",
      ".kggggggggk.",
      ".kggggggggk.",
      "..kggggggk..",
      "...kkkkkk...",
    ]),
  },
  {
    id: "snake-fang",
    name: "Snake Fang",
    kind: "body",
    brew: "#9aa04a",
    body: { family: "serpent", archetypes: ["snake", "viper", "cobra", "constrictor", "worm", "sandworm"], hue: 95, material: "scales" },
    palette: { k: "#3a2a2a", w: "#f4efe2", c: "#c9bfa8" },
    art: fill([
      "............",
      ".kkkkkkkkkk.",
      ".kwwwwwwwwk.",
      "..kwwwwwwk..",
      "..kwwwwcwk..",
      "...kwwwck...",
      "...kwwck....",
      "....kwck....",
      "....kwk.....",
      ".....kk.....",
    ]),
  },
  {
    id: "wolf-fur",
    name: "Wolf Fur",
    kind: "body",
    brew: "#8a90a0",
    body: { family: "quadruped", archetypes: ["canine", "feline", "ursine", "beast", "beast", "boar", "equine", "cervine", "rodent", "bovine"], hue: 250, material: "fur" },
    palette: { k: "#2c2f38", g: "#6b7280", l: "#a9b0bc", w: "#dfe3ea" },
    art: fill([
      "............",
      "...k...k....",
      "..kgk.kgk.k.",
      "..kgkkglkkgk",
      ".kglgkglggk.",
      ".kgllgllgggk",
      "kgglllllllgk",
      "kglllwwllggk",
      "kgllwwwllgk.",
      ".kgllllllgk.",
      "..kkkkkkkk..",
    ]),
  },
  {
    id: "troll-toenail",
    name: "Troll Toenail",
    kind: "body",
    brew: "#b4a83a",
    body: { family: "biped", archetypes: ["goblin", "goblin", "troll", "ogre", "imp", "kobold", "yeti", "orc", "dwarf", "golem"], hue: 100, material: "hide" },
    palette: { k: "#4a3a10", y: "#c9b23a", l: "#e8da7a", g: "#7a8a2a" },
    art: fill([
      "............",
      "............",
      "..kkkkkkkk..",
      ".kyyllyyyyk.",
      "kyllllyyyyyk",
      "kylllyyyyygk",
      "kyyyyyyyyggk",
      "kgyyyyyyyggk",
      ".kggyyyyggk.",
      "..kkkkkkkk..",
    ]),
  },
  {
    id: "magic-seed",
    name: "Magic Seed",
    kind: "body",
    brew: "#6aae5a",
    body: { family: "plantfolk", archetypes: ["sapling", "mandrake", "flytrap", "cactus", "bloom"], hue: 120, material: "leaf" },
    palette: { k: "#3a2414", b: "#8a5a2e", l: "#c08a4e", g: "#4f9c63", n: "#8fd07a" },
    art: fill([
      ".....g.n....",
      "....gnng....",
      ".....gg.....",
      ".....kk.....",
      "....kbbk....",
      "...kbllbk...",
      "..kbllbbbk..",
      "..kblbbbbk..",
      "..kbbbbbbk..",
      "...kbbbbk...",
      "....kkkk....",
    ]),
  },
  {
    id: "toadstool",
    name: "Toadstool",
    kind: "body",
    brew: "#d9584a",
    body: { family: "plantfolk", archetypes: ["mushroom"], hue: 20, pattern: "spots" },
    palette: { k: "#4a1414", r: "#d94a3a", w: "#fbf1e0", s: "#e8dcc4" },
    art: fill([
      "....kkkk....",
      "..kkrrrrkk..",
      ".krrwrrrwrk.",
      "krwwrrrrrrrk",
      "krrrrrwwrrrk",
      "kkkkkkkkkkkk",
      "....kssk....",
      "....kwsk....",
      "....kwsk....",
      "...kwwssk...",
      "...kkkkkk...",
    ]),
  },
  {
    id: "ember",
    name: "Ember",
    kind: "magic",
    brew: "#f07a2a",
    magic: { hue: 32, saturation: 0.88, value: 0.55, glow: 0.45 },
    palette: { k: "#6a1a0a", r: "#e0472a", o: "#f08a2a", y: "#f8d24a", w: "#fff6c8" },
    art: fill([
      ".....k......",
      "....kr......",
      "....krk..k..",
      "...krrk.krk.",
      "..krorrkkrk.",
      "..kroorrrrk.",
      ".krooyorrrk.",
      ".kroyyyoork.",
      ".kroywyyork.",
      ".krooyyoork.",
      "..krrooorrk.",
      "...kkkkkkk..",
    ]),
  },
  {
    id: "frost-crystal",
    name: "Frost Crystal",
    kind: "magic",
    brew: "#7ac4f0",
    magic: { hue: 215, saturation: 0.5, value: 0.8, genes: { "color.scheme": "analogous" } },
    palette: { k: "#1c3a5a", c: "#6ab8e8", l: "#bfe6fa", w: "#ffffff" },
    art: fill([
      ".....kk.....",
      "....kclk....",
      "...kcclwk...",
      "..kccclwlk..",
      ".kcccclwllk.",
      "kccccclwlllk",
      ".kcccclllck.",
      "..kccclllk..",
      "...kcclck...",
      "....kclk....",
      ".....kk.....",
    ]),
  },
  {
    id: "moon-dust",
    name: "Moon Dust",
    kind: "magic",
    brew: "#9a7ae0",
    magic: { hue: 295, saturation: 0.6, value: 0.42, glow: 0.85 },
    palette: { k: "#2a1f4a", m: "#9a7ae0", l: "#d6c8ff", s: "#fff2b0" },
    art: fill([
      "...kkkk.....",
      "..kmmmmk..s.",
      ".kmmlkk..sss",
      ".kmlk.....s.",
      "kmmlk.......",
      "kmmlk.......",
      "kmmlk.......",
      "kmmmlk......",
      ".kmmmlkk..s.",
      ".kmmmmmmkkk.",
      "..kkmmmmmk..",
      "....kkkkk...",
    ]),
  },
  {
    id: "gold-coin",
    name: "Gold Coin",
    kind: "magic",
    brew: "#e8b53e",
    magic: { hue: 85, saturation: 0.82, value: 0.72, genes: { "color.accent": "gold", "color.scheme": "monochrome" } },
    palette: { k: "#6a4a10", y: "#e8b53e", l: "#f8dc7a", d: "#b8862a" },
    art: fill([
      "...kkkkkk...",
      "..kyyyyyyk..",
      ".kyllllllyk.",
      "kylyyyyyydyk",
      "kylyddddydyk",
      "kylydyyyydyk",
      "kylydyyyydyk",
      "kylyddddydyk",
      "kyyyyyyyydyk",
      ".kydddddddk.",
      "..kyyyyyyk..",
      "...kkkkkk...",
    ]),
  },
  {
    id: "rainbow-drop",
    name: "Rainbow Drop",
    kind: "magic",
    brew: "#e86ab0",
    magic: { rainbow: true, saturation: 0.92, value: 0.62, genes: { "color.scheme": "triadic" } },
    palette: { k: "#2a2238", r: "#e0472a", o: "#f08a2a", y: "#f8d24a", g: "#4f9c63", b: "#4467c9", p: "#8d5aa6", w: "#ffffff" },
    art: fill([
      ".....kk.....",
      "....krrk....",
      "...krrrrk...",
      "..kooooook..",
      "..kywyyyyk..",
      ".kggggggggk.",
      ".kbbbbbbbbk.",
      ".kppppppppk.",
      "..kppppppk..",
      "...kkkkkk...",
    ]),
  },
  {
    id: "lightning",
    name: "Lightning",
    kind: "magic",
    brew: "#f8d24a",
    magic: { genes: { "motion.energy": 0.97, "motion.speed": 0.95, "motion.bounce": 0.9, "motion.aggression": 0.8, "motion.curiosity": 0.9 } },
    palette: { k: "#5a4a10", y: "#f8d24a", w: "#fff6c8" },
    art: fill([
      "......kkkk..",
      ".....kyyk...",
      "....kyyk....",
      "...kywyk....",
      "..kyyyykkk..",
      "..kkkkyyyk..",
      ".....kyyk...",
      "....kyyk....",
      "...kyyk.....",
      "...kyk......",
      "...kk.......",
    ]),
  },
  {
    id: "giant-bean",
    name: "Giant Bean",
    kind: "magic",
    brew: "#4f9c63",
    magic: { size: 0.32 },
    palette: { k: "#1e4a1e", g: "#4f9c63", l: "#8fd07a" },
    art: fill([
      "............",
      "............",
      "..kkkk..kkk.",
      ".kllggkkgggk",
      "kllgggggggk.",
      "kgggggggggk.",
      "kgggggggggk.",
      ".kggggggggk.",
      ".kkgggggggk.",
      "...kkkkkkk..",
    ]),
  },
  {
    id: "pixie-dust",
    name: "Pixie Dust",
    kind: "magic",
    brew: "#f0a6d0",
    magic: { size: -0.32, glow: 0.35 },
    palette: { p: "#e87ab8", l: "#f6c6e0", y: "#f8d24a", w: "#ffffff" },
    art: fill([
      "............",
      "...l........",
      "..lwl....y..",
      "...l....ywy.",
      ".........y..",
      ".....p......",
      "....pwp.....",
      ".....p......",
      ".y.......l..",
      "ywy.....lwl.",
      ".y.......l..",
    ]),
  },
  {
    id: "tiger-stripe",
    name: "Tiger Stripe",
    kind: "magic",
    brew: "#f08a2a",
    magic: { genes: { "pattern.type": "stripes", "pattern.density": 0.75, "pattern.size": 0.45, "pattern.dark": true } },
    palette: { k: "#2a1a10", o: "#f08a2a" },
    art: fill([
      "............",
      ".kkkkkkkkkk.",
      "kookoookoook",
      "kokooookoook",
      "kokoookooook",
      "kookooookook",
      "koookoookook",
      "kookooookook",
      "kokoookooook",
      "kookoookoook",
      ".kkkkkkkkkk.",
    ]),
  },
  {
    id: "spotted-egg",
    name: "Spotted Egg",
    kind: "magic",
    brew: "#c8d0a0",
    magic: { genes: { "pattern.type": "spots", "pattern.density": 0.7, "pattern.size": 0.55, "pattern.dark": true } },
    palette: { k: "#3a3020", e: "#f2e8d0", s: "#6a8a4a", h: "#ffffff" },
    art: fill([
      "....kkkk....",
      "...keeeek...",
      "..keheseek..",
      "..kheeeesk..",
      ".keeseeeeek.",
      ".keeeeeseek.",
      ".kseeeeeeek.",
      ".keeesseeek.",
      "..keeeeeek..",
      "...kkkkkk...",
    ]),
  },
];

export const MAX_PICKS = 5;

const byId = new Map(INGREDIENTS.map((i) => [i.id, i]));
export const ingredient = (id: string) => byId.get(id);

/** Every creature kind the generator can make, with friendly names. */
export const KINDS: { family: string; label: string; archetypes: [string, string][] }[] = [
  { family: "reptile", label: "Reptiles & Dragons", archetypes: [["lizard", "Lizard"], ["crocodile", "Crocodile"], ["tortoise", "Tortoise"], ["salamander", "Salamander"], ["drake", "Drake"], ["dragon", "Dragon"]] },
  { family: "winged", label: "Winged Creatures", archetypes: [["songbird", "Songbird"], ["raptor", "Raptor"], ["owl", "Owl"], ["bat", "Bat"], ["moth", "Moth"], ["dragonfly", "Dragonfly"]] },
  { family: "aquatic", label: "Water Creatures", archetypes: [["reef", "Reef Fish"], ["shark", "Shark"], ["ray", "Ray"], ["puffer", "Pufferfish"], ["angler", "Anglerfish"], ["eel", "Eel"]] },
  { family: "arthropod", label: "Bugs & Crawlers", archetypes: [["spider", "Spider"], ["beetle", "Beetle"], ["ant", "Ant"], ["scorpion", "Scorpion"], ["crab", "Crab"], ["mantis", "Mantis"]] },
  { family: "amorphous", label: "Slimes & Squishies", archetypes: [["slime", "Slime"], ["ooze", "Ooze"], ["octopus", "Octopus"], ["jelly", "Jellyfish"], ["beholder", "Floating Eye"], ["wisp", "Wisp"]] },
  { family: "serpent", label: "Snakes & Worms", archetypes: [["snake", "Snake"], ["viper", "Viper"], ["cobra", "Cobra"], ["constrictor", "Constrictor"], ["worm", "Worm"], ["sandworm", "Sandworm"]] },
  { family: "quadruped", label: "Beasts", archetypes: [["canine", "Wolf"], ["feline", "Wildcat"], ["bovine", "Big Grazer"], ["cervine", "Deer"], ["ursine", "Bear"], ["rodent", "Critter"], ["boar", "Boar"], ["beast", "Fantasy Beast"], ["equine", "Horse"]] },
  { family: "biped", label: "Goblins & Giants", archetypes: [["goblin", "Goblin"], ["troll", "Troll"], ["golem", "Golem"], ["ogre", "Ogre"], ["imp", "Imp"], ["kobold", "Kobold"], ["yeti", "Yeti"], ["orc", "Orc"], ["dwarf", "Dwarf"]] },
  { family: "plantfolk", label: "Plant Folk", archetypes: [["mandrake", "Mandrake"], ["sapling", "Sapling"], ["mushroom", "Mushroom Folk"], ["flytrap", "Flytrap"], ["cactus", "Cactus"], ["bloom", "Blossom"]] },
];

export const TOTAL_KINDS = KINDS.reduce((a, k) => a + k.archetypes.length, 0);
const kindLabels = new Map(KINDS.flatMap((k) => k.archetypes.map(([id, label]) => [`${k.family}/${id}`, label] as const)));
export const kindLabel = (family: string, archetype: string) => kindLabels.get(`${family}/${archetype}`) ?? archetype;

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const newSeed = () => {
  const a = new Uint32Array(2);
  crypto.getRandomValues(a);
  return String(a[0] * 2 ** 21 + (a[1] >>> 11));
};

/** Average of hues on the color wheel, weighted. */
function blendHue(hues: { hue: number; w: number }[]): number {
  let x = 0;
  let y = 0;
  for (const { hue, w } of hues) {
    x += Math.cos((hue * Math.PI) / 180) * w;
    y += Math.sin((hue * Math.PI) / 180) * w;
  }
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/**
 * Turns a pot of ingredients into a recipe. Every call rolls a new seed, so the same pot
 * makes a new creature each time.
 * - Body ingredients pick the family and kind. Two from the same family breed together.
 * - A body ingredient from a second family lends its skin: material, color and pattern.
 * - Magic ingredients set colors, size, pattern and personality.
 */
export function brew(picks: string[]): { recipe: Recipe; surprise: boolean } {
  const items = picks.map(ingredient).filter((i): i is Ingredient => !!i);
  const bodies = items.filter((i) => i.body);
  const surprise = bodies.length === 0;
  const pool = surprise ? [pick(INGREDIENTS.filter((i) => i.body))] : bodies;

  const main = pick(pool)!;
  const family = main.body!.family;
  const recipe: Recipe = {
    family,
    archetype: pick(main.body!.archetypes),
    seed: newSeed(),
    genes: {},
    nudge: {},
    clips: ["idle", "action"],
    dir: 7,
  };

  const kin = pool.filter((i) => i.body!.family === family);
  if (kin.length > 1) {
    const others = kin.filter((i) => i !== main);
    const mate = others.length ? pick(others) : main;
    recipe.mate = { archetype: pick(mate.body!.archetypes), seed: newSeed() };
  }

  const stranger = pool.find((i) => i.body!.family !== family);
  if (stranger) {
    const b = stranger.body!;
    if (b.material) recipe.genes["surface.material"] = b.material;
    if (b.pattern) recipe.genes["pattern.type"] = b.pattern;
    recipe.genes["color.hue"] = b.hue;
    recipe.genes["color.saturation"] = 0.62;
  }
  if (main.body!.pattern) recipe.genes["pattern.type"] = main.body!.pattern;

  const magic = items.filter((i) => i.magic).map((i) => i.magic!);
  const hues: { hue: number; w: number }[] = [];
  const sats: number[] = [];
  const vals: number[] = [];
  let glow = 0;
  for (const m of magic) {
    if (m.rainbow) hues.push({ hue: Math.random() * 360, w: 1 });
    else if (m.hue !== undefined) hues.push({ hue: m.hue, w: 1 });
    if (m.saturation !== undefined) sats.push(m.saturation);
    if (m.value !== undefined) vals.push(m.value);
    if (m.glow) glow = Math.max(glow, m.glow);
    if (m.size) recipe.nudge.size = (recipe.nudge.size ?? 0) + m.size;
    Object.assign(recipe.genes, m.genes);
  }
  if (hues.length) recipe.genes["color.hue"] = Math.round(blendHue(hues));
  if (sats.length) recipe.genes["color.saturation"] = sats.reduce((a, b) => a + b, 0) / sats.length;
  if (vals.length) recipe.genes["color.value"] = vals.reduce((a, b) => a + b, 0) / vals.length;
  if (glow) recipe.genes["color.glow"] = glow;

  return { recipe, surprise };
}

/** The color of the brew in the pot: a mix of each ingredient's color. */
export function potColor(picks: string[]): string | null {
  const items = picks.map(ingredient).filter((i): i is Ingredient => !!i);
  if (!items.length) return null;
  let r = 0;
  let g = 0;
  let b = 0;
  for (const i of items) {
    const n = parseInt(i.brew.slice(1), 16);
    r += n >> 16;
    g += (n >> 8) & 255;
    b += n & 255;
  }
  const c = (v: number) => Math.round(v / items.length).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}
