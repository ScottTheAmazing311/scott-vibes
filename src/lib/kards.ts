// Knudson Kards: the Kid Zone's daily card pack game.
// 48 cards across four series. Animal cards use Dad's own photos (pulled from
// the kidAnimals registry); the other series are drawn in KardArt.tsx.
// To add a card: add it here and, unless it has a photo, draw it in KardArt.

import { kidAnimals } from "./kidzone";

export type KardRarity = "common" | "rare" | "epic" | "legendary";
export type KardSeries = "animals" | "dinos" | "space" | "snacks";

export interface Kard {
  id: string;
  name: string;
  series: KardSeries;
  rarity: KardRarity;
  fact: string;
  /** full-art photo card; everything else is drawn by KardArt */
  photo?: string;
}

export const kardSeries: { id: KardSeries; label: string; accent: "marigold" | "brick" | "leaf" | "cobalt" }[] = [
  { id: "animals", label: "Wild Animals", accent: "leaf" },
  { id: "dinos", label: "Dino Squad", accent: "brick" },
  { id: "space", label: "Outer Space", accent: "cobalt" },
  { id: "snacks", label: "Snack Shack", accent: "marigold" },
];

/* pull odds per card slot; a pack is 5 cards with at least one rare or better */
export const RARITY_ODDS: { rarity: KardRarity; weight: number }[] = [
  { rarity: "common", weight: 60 },
  { rarity: "rare", weight: 28 },
  { rarity: "epic", weight: 9 },
  { rarity: "legendary", weight: 3 },
];

const photoOf = (id: string) => kidAnimals.find((a) => a.id === id)?.photo;

export const kards: Kard[] = [
  /* ---- Wild Animals: Dad's photos ---- */
  { id: "snow-leopard", name: "Snow Leopard", series: "animals", rarity: "legendary", fact: "The ghost of the mountains. Its tail is almost as long as its body.", photo: photoOf("snow-leopard") },
  { id: "tiger", name: "Tiger", series: "animals", rarity: "epic", fact: "Every tiger's stripes are one of a kind, like your fingerprints.", photo: photoOf("tiger") },
  { id: "bald-eagle", name: "Bald Eagle", series: "animals", rarity: "epic", fact: "Can spot a fish from two miles up in the sky.", photo: photoOf("bald-eagle") },
  { id: "cougar", name: "Cougar", series: "animals", rarity: "rare", fact: "Can leap 15 feet straight up from standing still.", photo: photoOf("cougar") },
  { id: "orangutan", name: "Orangutan", series: "animals", rarity: "rare", fact: "Builds a brand new treetop bed to sleep in every night.", photo: photoOf("orangutan") },
  { id: "crocodile", name: "Crocodile", series: "animals", rarity: "rare", fact: "Has been around since the dinosaurs, barely changed.", photo: photoOf("crocodile") },
  { id: "horse", name: "Horse", series: "animals", rarity: "common", fact: "Can sleep standing up without falling over.", photo: photoOf("horse") },
  { id: "sheep", name: "Sheep", series: "animals", rarity: "common", fact: "Remembers the faces of 50 different friends.", photo: photoOf("sheep") },
  { id: "otter", name: "River Otter", series: "animals", rarity: "common", fact: "Holds hands with other otters so they don't drift apart.", photo: photoOf("otter") },
  { id: "flamingo", name: "Flamingo", series: "animals", rarity: "common", fact: "Turns pink from the shrimp it eats.", photo: photoOf("flamingo") },
  { id: "barn-owl", name: "Barn Owl", series: "animals", rarity: "common", fact: "Flies so quietly that mice never hear it coming.", photo: photoOf("barn-owl") },
  { id: "bee", name: "Bumblebee", series: "animals", rarity: "common", fact: "Visits up to 1,000 flowers in a single day.", photo: photoOf("bee") },

  /* ---- Dino Squad ---- */
  { id: "trex", name: "T. Rex", series: "dinos", rarity: "legendary", fact: "The strongest bite of any land animal, ever." },
  { id: "spinosaurus", name: "Spinosaurus", series: "dinos", rarity: "epic", fact: "Bigger than T. rex, and it could swim." },
  { id: "mosasaurus", name: "Mosasaurus", series: "dinos", rarity: "epic", fact: "The giant sea dragon of the dinosaur age." },
  { id: "triceratops", name: "Triceratops", series: "dinos", rarity: "rare", fact: "Three horns and a neck shield like a knight." },
  { id: "velociraptor", name: "Velociraptor", series: "dinos", rarity: "rare", fact: "Fast and clever, but only the size of a turkey." },
  { id: "brachiosaurus", name: "Brachiosaurus", series: "dinos", rarity: "rare", fact: "As tall as a four story building." },
  { id: "stegosaurus", name: "Stegosaurus", series: "dinos", rarity: "common", fact: "Bus sized body, brain the size of a hot dog." },
  { id: "ankylosaurus", name: "Ankylosaurus", series: "dinos", rarity: "common", fact: "A living tank with a club for a tail." },
  { id: "pteranodon", name: "Pteranodon", series: "dinos", rarity: "common", fact: "Soared on wings wider than a car is long." },
  { id: "parasaurolophus", name: "Parasaurolophus", series: "dinos", rarity: "common", fact: "Its head crest honked like a trumpet." },
  { id: "diplodocus", name: "Diplodocus", series: "dinos", rarity: "common", fact: "Longer than two school buses, with a whip tail." },
  { id: "pachy", name: "Pachycephalosaurus", series: "dinos", rarity: "common", fact: "Head butted rivals with a ten inch thick skull." },

  /* ---- Outer Space ---- */
  { id: "black-hole", name: "Black Hole", series: "space", rarity: "legendary", fact: "Pulls so hard that even light can't escape." },
  { id: "sun", name: "The Sun", series: "space", rarity: "epic", fact: "A million Earths could fit inside it." },
  { id: "saturn", name: "Saturn", series: "space", rarity: "epic", fact: "Its rings are made of billions of ice chunks." },
  { id: "earth", name: "Earth", series: "space", rarity: "rare", fact: "The only planet with oceans, forests, and pizza." },
  { id: "jupiter", name: "Jupiter", series: "space", rarity: "rare", fact: "Its red spot is a storm bigger than Earth." },
  { id: "comet", name: "Comet", series: "space", rarity: "rare", fact: "A dusty snowball with a tail millions of miles long." },
  { id: "mercury", name: "Mercury", series: "space", rarity: "common", fact: "Zips around the Sun in just 88 days." },
  { id: "venus", name: "Venus", series: "space", rarity: "common", fact: "The hottest planet, even hotter than Mercury." },
  { id: "moon", name: "The Moon", series: "space", rarity: "common", fact: "Astronaut footprints will stay there for millions of years." },
  { id: "mars", name: "Mars", series: "space", rarity: "common", fact: "Home to the tallest volcano in the solar system." },
  { id: "uranus", name: "Uranus", series: "space", rarity: "common", fact: "It rolls around the Sun lying on its side." },
  { id: "neptune", name: "Neptune", series: "space", rarity: "common", fact: "Its winds blow over 1,000 miles per hour." },

  /* ---- Snack Shack ---- */
  { id: "cake", name: "Birthday Cake", series: "snacks", rarity: "legendary", fact: "The rarest snack of all. Only appears once a year!" },
  { id: "pizza", name: "Pizza Slice", series: "snacks", rarity: "epic", fact: "Americans eat about 350 slices every second." },
  { id: "ice-cream", name: "Ice Cream", series: "snacks", rarity: "epic", fact: "It takes about 50 licks to finish one scoop." },
  { id: "taco", name: "Taco", series: "snacks", rarity: "rare", fact: "There's a whole holiday for tacos: Taco Tuesday." },
  { id: "burger", name: "Cheeseburger", series: "snacks", rarity: "rare", fact: "The world's biggest burger weighed more than a cow." },
  { id: "donut", name: "Donut", series: "snacks", rarity: "rare", fact: "The hole was invented so they'd cook all the way through." },
  { id: "fries", name: "French Fries", series: "snacks", rarity: "common", fact: "Perfectly crispy outside, fluffy inside." },
  { id: "hot-dog", name: "Hot Dog", series: "snacks", rarity: "common", fact: "Astronauts have eaten hot dogs on the Moon missions." },
  { id: "watermelon", name: "Watermelon", series: "snacks", rarity: "common", fact: "It's 92 percent water. Basically a drink you can bite." },
  { id: "pancakes", name: "Pancakes", series: "snacks", rarity: "common", fact: "The tallest pancake stack was over three feet high." },
  { id: "sushi", name: "Sushi Roll", series: "snacks", rarity: "common", fact: "Rolled rice and seaweed, invented centuries ago in Japan." },
  { id: "popcorn", name: "Popcorn", series: "snacks", rarity: "common", fact: "Each kernel pops when it hits about 350 degrees." },
];
