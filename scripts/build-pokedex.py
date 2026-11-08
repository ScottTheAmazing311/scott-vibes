# Rebuilds public/kidzone/pokedex.json for Poké Packs from PokeAPI's CSV data.
# Fetch the CSVs first (pokemon_species, pokemon_species_names, pokemon_types, types,
# pokemon_stats, pokemon_species_flavor_text) from
# https://github.com/PokeAPI/pokeapi/tree/master/data/v2/csv into a folder, then run:
#   python3 scripts/build-pokedex.py <csv-folder> public/kidzone/pokedex.json
# Each row: [id, name, generation, types, rarity, Pokédex line, [hp, attack, defense, speed]].
# Rarity: legendary/mythical -> legendary; base stat total 500+ -> epic; 400+ -> rare.
import csv, json, sys, re, collections
d = sys.argv[1]
def rows(f): return list(csv.DictReader(open(f"{d}/{f}.csv", encoding="utf-8")))
types = {r["id"]: r["identifier"] for r in rows("types")}
species = {int(r["id"]): r for r in rows("pokemon_species")}
names = {}
for r in rows("pokemon_species_names"):
    if r["local_language_id"] == "9": names[int(r["pokemon_species_id"])] = r["name"]
# default pokemon id == species id for 1..1025
ptypes = collections.defaultdict(list)
for r in rows("pokemon_types"):
    ptypes[int(r["pokemon_id"])].append((int(r["slot"]), types[r["type_id"]]))
bst = collections.Counter()
stat = collections.defaultdict(dict)
for r in rows("pokemon_stats"):
    bst[int(r["pokemon_id"])] += int(r["base_stat"])
    stat[int(r["pokemon_id"])][int(r["stat_id"])] = int(r["base_stat"])
flav = {}
for r in rows("pokemon_species_flavor_text"):
    if r["language_id"] == "9":
        flav[int(r["species_id"])] = r["flavor_text"]  # later versions overwrite earlier
out = []
for i in sorted(species):
    s = species[i]
    leg = s["is_legendary"] == "1" or s["is_mythical"] == "1"
    b = bst[i]
    rar = "legendary" if leg else "epic" if b >= 500 else "rare" if b >= 400 else "common"
    t = re.sub(r"\s+", " ", flav.get(i, "").replace("\f", " ").replace("­", "")).strip()
    # first sentence keeps the file small and the card readable
    m = re.match(r"(.+?[.!?])(\s|$)", t)
    t = m.group(1) if m else t
    out.append([i, names[i], int(s["generation_id"]), [n for _, n in sorted(ptypes[i])], rar, t,
                # base HP, Attack, Defense, Speed for the card's stat row
                [stat[i].get(k, 0) for k in (1, 2, 3, 6)]])
print(collections.Counter(o[4] for o in out), len(out), file=sys.stderr)
json.dump(out, open(sys.argv[2], "w"), ensure_ascii=False, separators=(",", ":"))
