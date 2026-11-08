// Shared Poké Packs data. Sprites come straight from the PokeAPI sprites repo;
// names, types, stats and Pokédex lines are baked into /public/kidzone/pokedex.json
// by scripts/build-pokedex.py.

const SPRITES = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
export const art = (id: number, shiny = false) => `${SPRITES}/other/official-artwork/${shiny ? "shiny/" : ""}${id}.png`;
export const pixel = (id: number) => `${SPRITES}/${id}.png`;

export type Rarity = "common" | "rare" | "epic" | "legendary";

export interface Mon {
  id: number;
  name: string;
  gen: number;
  types: string[];
  rarity: Rarity;
  fact: string;
  /** base HP, Attack, Defense, Speed */
  stats: [number, number, number, number];
}

export interface Pull {
  id: number;
  shiny: boolean;
}

export type DexRow = [number, string, number, string[], Rarity, string, [number, number, number, number]];

export const fromRow = ([id, name, gen, types, rarity, fact, stats]: DexRow): Mon => ({ id, name, gen, types, rarity, fact, stats });

export const RARITY: Record<Rarity, { label: string; color: string; points: number }> = {
  common: { label: "Common", color: "var(--kz-ink-soft)", points: 10 },
  rare: { label: "Rare", color: "var(--kz-cobalt)", points: 25 },
  epic: { label: "Epic", color: "var(--kz-marigold)", points: 60 },
  legendary: { label: "Legendary", color: "var(--kz-brick)", points: 200 },
};

/** Card points: the pack-total score. Shinies are worth five times as much. */
export const points = (mon: Mon, shiny: boolean) => RARITY[mon.rarity].points * (shiny ? 5 : 1);

/** Big pulls arrive face-down and get their own flip. */
export const isBigPull = (mon: Mon, shiny: boolean) => shiny || mon.rarity === "epic" || mon.rarity === "legendary";

// Each type gets a strong frame color and a soft tint, pulled toward the Kid Zone palette.
export const TYPES: Record<string, [string, string]> = {
  normal: ["#9a9682", "#ece9df"],
  fire: ["#d95b43", "#f6dccf"],
  water: ["#4467c9", "#dbe2f5"],
  grass: ["#4f9c63", "#d9e9d6"],
  electric: ["#d9a21f", "#f6e9bf"],
  ice: ["#5ba8b5", "#d8edf0"],
  fighting: ["#b5473a", "#f0d6d1"],
  poison: ["#8d5aa6", "#eadcf0"],
  ground: ["#b88a45", "#efe2cc"],
  flying: ["#7f8fd6", "#e1e5f6"],
  psychic: ["#d4587e", "#f6d9e2"],
  bug: ["#8a9a2e", "#e6ead0"],
  rock: ["#a3904f", "#ebe4cf"],
  ghost: ["#6a5e9c", "#e0dcef"],
  dragon: ["#5a54c4", "#dedcf4"],
  dark: ["#5d5149", "#e3dfdb"],
  steel: ["#7f8ea0", "#e2e6eb"],
  fairy: ["#d47fb0", "#f6e0ec"],
};

export const REGIONS = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar", "Paldea"];

export const pad = (n: number) => `#${String(n).padStart(3, "0")}`;
