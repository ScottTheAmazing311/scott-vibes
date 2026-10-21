// Kid Zone registry + game data. To add a game: add an entry here, a route at
// src/app/kidzone/<slug>/page.tsx, and a component in src/components/kidzone/.
// To add trivia questions, flash card decks, or piano songs, just edit the data.

export interface KidGame {
  slug: string;
  title: string;
  /** geometric mark, see components/kidzone/Mark.tsx */
  shape: "circle" | "triangle" | "bars" | "cards" | "ring" | "paw" | "star" | "oval";
  blurb: string;
  /** token name of the game's toy color */
  accent: "marigold" | "brick" | "leaf" | "cobalt";
}

export const kidGames: KidGame[] = [
  { slug: "trivia", title: "Trivia Blast", shape: "circle", blurb: "Animals, space, and brain teasers. Can you get three stars?", accent: "marigold" },
  { slug: "dash", title: "Shape Dash", shape: "triangle", blurb: "Jump the spikes! How far can you run?", accent: "brick" },
  { slug: "piano", title: "Piano Lab", shape: "bars", blurb: "Play for real, or learn a song note by note.", accent: "leaf" },
  { slug: "cards", title: "Flash Cards", shape: "cards", blurb: "Math facts and sight words, one flip at a time.", accent: "cobalt" },
  { slug: "animals", title: "Animal Awesome", shape: "paw", blurb: "Dad's animal photos, wild sounds, and wow facts.", accent: "leaf" },
  { slug: "countdown", title: "Countdown", shape: "ring", blurb: "How many sleeps until the good stuff?", accent: "cobalt" },
  { slug: "santa", title: "Letters to Santa", shape: "star", blurb: "Write your wish list and send it to the North Pole.", accent: "brick" },
  { slug: "nfl", title: "NFL Matchup", shape: "oval", blurb: "Pick who wins this week and defend your record.", accent: "marigold" },
];

/* ---------------- Countdown ---------------- */

export interface CountdownEvent {
  id: string;
  title: string;
  /** MM-DD for yearly events, or YYYY-MM-DD for one-time dates */
  date: string;
  accent: KidGame["accent"];
}

// TODO: add the kids' birthdays (yearly MM-DD entries).
export const countdownEvents: CountdownEvent[] = [
  { id: "christmas", title: "Christmas", date: "12-25", accent: "brick" },
  { id: "halloween", title: "Halloween", date: "10-31", accent: "marigold" },
  { id: "thanksgiving", title: "Thanksgiving", date: "2026-11-26", accent: "leaf" },
  { id: "newyear", title: "New Year's Day", date: "01-01", accent: "cobalt" },
  { id: "lastday", title: "Last Day of School", date: "2027-05-28", accent: "marigold" },
];

/* ---------------- Animal Awesome ---------------- */

export type AnimalCall =
  | "roar" | "chuff" | "whoop" | "screech" | "neigh" | "baa"
  | "squeak" | "growl" | "honk" | "hiss-screech" | "buzz" | "purr";

export interface KidAnimal {
  id: string;
  name: string;
  /** Sanity photo URL from Dad's Animals series */
  photo: string;
  /** portrait or landscape framing */
  tall: boolean;
  call: AnimalCall;
  callLabel: string;
  facts: string[];
  wow: string;
}

export const kidAnimals: KidAnimal[] = [
  {
    id: "tiger", name: "Tiger", call: "roar", callLabel: "Hear the roar", tall: false,
    photo: "https://cdn.sanity.io/images/1tz611ft/production/78925c8aa0b05ab9277a5548e3f45aa37a4b844a-2001x2191.jpg",
    facts: ["A tiger's stripes are on its skin, not just its fur.", "Tigers love to swim, unlike most cats."],
    wow: "A tiger's roar can be heard almost two miles away.",
  },
  {
    id: "snow-leopard", name: "Snow Leopard", call: "chuff", callLabel: "Hear the chuff", tall: true,
    photo: "https://cdn.sanity.io/images/1tz611ft/production/2680d2bcfcc6232325a4505e02442d129225a823-1667x2500.jpg",
    facts: ["Its huge fluffy tail works like a scarf on cold nights.", "It can jump about as far as a school bus is long."],
    wow: "Snow leopards cannot roar. They chuff and puff instead.",
  },
  {
    id: "orangutan", name: "Orangutan", call: "whoop", callLabel: "Hear the whoop", tall: false,
    photo: "https://cdn.sanity.io/images/1tz611ft/production/77ccb799015d03689548f892cb5d73fea67ba8e3-2500x1667.jpg",
    facts: ["Orangutan means 'person of the forest' in Malay.", "They build a brand-new leaf nest to sleep in every night."],
    wow: "An orangutan's arms stretch wider than your dad is tall.",
  },
  {
    id: "bald-eagle", name: "Bald Eagle", call: "screech", callLabel: "Hear the cry", tall: true,
    photo: "https://cdn.sanity.io/images/1tz611ft/production/cf8a8abccfda1625e8e361917c8c87c840742c3f-1667x2500.jpg",
    facts: ["Eagles can spot a fish from more than a mile up.", "Their nests can weigh as much as a car."],
    wow: "Movie eagle screams are fake. Real bald eagles sound like squeaky giggles.",
  },
  {
    id: "horse", name: "Horse", call: "neigh", callLabel: "Hear the neigh", tall: false,
    photo: "https://cdn.sanity.io/images/1tz611ft/production/d65921940a3450236f2cde0459745c3ae802e982-2500x1783.jpg",
    facts: ["Horses can sleep standing up.", "A horse's eyes are bigger than almost any other land animal's."],
    wow: "Horses can't breathe through their mouths, only their noses.",
  },
  {
    id: "sheep", name: "Sheep", call: "baa", callLabel: "Hear the baa", tall: false,
    photo: "https://cdn.sanity.io/images/1tz611ft/production/851f4ef2085ff64fb415de2ffc44ded4a0b31bd2-2500x1572.jpg",
    facts: ["Sheep remember friends' faces for years.", "A sheep's wool never stops growing."],
    wow: "Sheep have rectangle-shaped pupils so they can see almost all the way around.",
  },
  {
    id: "otter", name: "River Otter", call: "squeak", callLabel: "Hear the squeak", tall: true,
    photo: "https://cdn.sanity.io/images/1tz611ft/production/cc2c1a08f4a2b5e0ddacbdea2cfcf3e318297287-1666x2500.jpg",
    facts: ["Otters can close their nose and ears underwater.", "They slide down mudbanks just for fun."],
    wow: "Sea otters hold hands while they sleep so they don't float apart.",
  },
  {
    id: "crocodile", name: "Crocodile", call: "growl", callLabel: "Hear the growl", tall: false,
    photo: "https://cdn.sanity.io/images/1tz611ft/production/b517c42c0a45354d55f0264c81c5830bed468d69-2500x1667.jpg",
    facts: ["Crocodiles have been around since the dinosaurs.", "They can go months between big meals."],
    wow: "A crocodile can't stick out its tongue.",
  },
  {
    id: "flamingo", name: "Flamingo", call: "honk", callLabel: "Hear the honk", tall: true,
    photo: "https://cdn.sanity.io/images/1tz611ft/production/4f6daab565603562a967b07ac7f27706ad047d3c-1699x2500.jpg",
    facts: ["Flamingos are born gray. Their food turns them pink.", "They eat with their heads upside down."],
    wow: "A flamingo can sleep while standing on one leg.",
  },
  {
    id: "barn-owl", name: "Barn Owl", call: "hiss-screech", callLabel: "Hear the screech", tall: true,
    photo: "https://cdn.sanity.io/images/1tz611ft/production/4ccc4afb89764c64680b0ee06582f73b1edb8f83-1667x2500.jpg",
    facts: ["Barn owls fly almost silently thanks to fringed feathers.", "They can hunt in total darkness, by sound alone."],
    wow: "Barn owls don't hoot. They screech like tiny dragons.",
  },
  {
    id: "bee", name: "Bumblebee", call: "buzz", callLabel: "Hear the buzz", tall: false,
    photo: "https://cdn.sanity.io/images/1tz611ft/production/f097c9f064217303f839040bdcc0a34ee17decdd-2500x1675.jpg",
    facts: ["Bees tell each other where flowers are by dancing.", "A bee visits hundreds of flowers in one trip."],
    wow: "The buzz is the sound of wings beating about 200 times a second.",
  },
  {
    id: "cougar", name: "Cougar", call: "purr", callLabel: "Hear the purr", tall: true,
    photo: "https://cdn.sanity.io/images/1tz611ft/production/2881a5d6d0ce79b79cefb588f618cc2c67211de3-1833x2500.jpg",
    facts: ["Cougars can leap over a minivan in one bound.", "They live all the way from Canada to Chile."],
    wow: "The cougar is the biggest cat that can purr, just like a house cat.",
  },
];

/* ---------------- Trivia ---------------- */

export interface TriviaQuestion {
  q: string;
  choices: string[];
  /** index into choices */
  answer: number;
}

export interface TriviaCategory {
  id: string;
  title: string;
  questions: TriviaQuestion[];
}

export const triviaCategories: TriviaCategory[] = [
  {
    id: "animals",
    title: "Amazing Animals",
    questions: [
      { q: "What is the tallest animal in the world?", choices: ["Elephant", "Giraffe", "Horse", "T-Rex"], answer: 1 },
      { q: "Which animal sleeps standing up?", choices: ["Horse", "Dog", "Snake", "Penguin"], answer: 0 },
      { q: "What do pandas eat almost all day?", choices: ["Pizza", "Fish", "Bamboo", "Honey"], answer: 2 },
      { q: "Which bird can fly backwards?", choices: ["Eagle", "Owl", "Duck", "Hummingbird"], answer: 3 },
      { q: "How many legs does a spider have?", choices: ["Six", "Eight", "Ten", "Four"], answer: 1 },
      { q: "What is a baby kangaroo called?", choices: ["A joey", "A cub", "A kit", "A calf"], answer: 0 },
      { q: "Which animal is the fastest runner on land?", choices: ["Lion", "Ostrich", "Cheetah", "Greyhound"], answer: 2 },
      { q: "What do bees make?", choices: ["Butter", "Honey", "Jam", "Syrup"], answer: 1 },
    ],
  },
  {
    id: "space",
    title: "Outer Space",
    questions: [
      { q: "Which planet is called the Red Planet?", choices: ["Venus", "Jupiter", "Mars", "Saturn"], answer: 2 },
      { q: "What do we call a person who travels to space?", choices: ["A pilot", "An astronaut", "A diver", "A wizard"], answer: 1 },
      { q: "What is the closest star to Earth?", choices: ["The Moon", "Polaris", "Mars", "The Sun"], answer: 3 },
      { q: "Which planet has beautiful rings?", choices: ["Saturn", "Mercury", "Earth", "Mars"], answer: 0 },
      { q: "How many planets are in our solar system?", choices: ["Seven", "Eight", "Nine", "Twelve"], answer: 1 },
      { q: "What does the Moon do to the ocean?", choices: ["Makes tides", "Makes it salty", "Makes waves glow", "Nothing"], answer: 0 },
      { q: "What is the biggest planet?", choices: ["Earth", "Neptune", "Jupiter", "Uranus"], answer: 2 },
      { q: "What do you call a rock that falls from space?", choices: ["A spaceberg", "A meteorite", "A moonrock", "A starball"], answer: 1 },
    ],
  },
  {
    id: "brain",
    title: "Brain Teasers",
    questions: [
      { q: "What has hands but cannot clap?", choices: ["A clock", "A tree", "A fish", "A sock"], answer: 0 },
      { q: "What gets wetter the more it dries?", choices: ["The sun", "A towel", "A rock", "A shoe"], answer: 1 },
      { q: "I'm full of holes but hold water. What am I?", choices: ["A bucket", "A net", "A sponge", "A cloud"], answer: 2 },
      { q: "What has a face and two hands but no arms?", choices: ["A clock", "A doll", "A book", "A door"], answer: 0 },
      { q: "What goes up but never comes down?", choices: ["A ball", "Rain", "Your age", "A kite"], answer: 2 },
      { q: "What has teeth but cannot bite?", choices: ["A shark", "A comb", "A dog", "A baby"], answer: 1 },
      { q: "What kind of room has no doors or windows?", choices: ["A bathroom", "A classroom", "A bedroom", "A mushroom"], answer: 3 },
      { q: "What can you catch but not throw?", choices: ["A ball", "A cold", "A frisbee", "A fish"], answer: 1 },
    ],
  },
];

/* ---------------- Flash cards ---------------- */

export interface FlashDeck {
  id: string;
  title: string;
  cards: { front: string; back: string }[];
}

export const flashDecks: FlashDeck[] = [
  {
    id: "add",
    title: "Addition",
    cards: [
      { front: "3 + 4", back: "7" }, { front: "6 + 5", back: "11" }, { front: "8 + 7", back: "15" },
      { front: "9 + 9", back: "18" }, { front: "4 + 8", back: "12" }, { front: "7 + 6", back: "13" },
      { front: "5 + 5", back: "10" }, { front: "2 + 9", back: "11" }, { front: "8 + 8", back: "16" },
      { front: "6 + 7", back: "13" }, { front: "9 + 4", back: "13" }, { front: "7 + 7", back: "14" },
    ],
  },
  {
    id: "multiply",
    title: "Multiplication",
    cards: [
      { front: "2 × 3", back: "6" }, { front: "4 × 4", back: "16" }, { front: "3 × 6", back: "18" },
      { front: "5 × 5", back: "25" }, { front: "6 × 7", back: "42" }, { front: "8 × 3", back: "24" },
      { front: "9 × 2", back: "18" }, { front: "7 × 7", back: "49" }, { front: "4 × 6", back: "24" },
      { front: "8 × 8", back: "64" }, { front: "9 × 6", back: "54" }, { front: "7 × 8", back: "56" },
    ],
  },
  {
    id: "sight",
    title: "Sight Words",
    cards: [
      { front: "because", back: "We stayed in because it rained." }, { front: "friend", back: "My friend shares with me." },
      { front: "could", back: "I could hear the birds." }, { front: "would", back: "Would you like a turn?" },
      { front: "there", back: "The park is over there." }, { front: "where", back: "Where did it go?" },
      { front: "through", back: "We walked through the gate." }, { front: "enough", back: "That's enough frosting!" },
      { front: "thought", back: "I thought it was funny." }, { front: "people", back: "Lots of people came." },
    ],
  },
];

/* ---------------- Piano ---------------- */

export interface PianoSong {
  id: string;
  title: string;
  /** note names with octave, e.g. "C4" — white and black keys both allowed */
  notes: string[];
}

export const pianoSongs: PianoSong[] = [
  {
    id: "hotcross",
    title: "Hot Cross Buns",
    notes: ["E4", "D4", "C4", "E4", "D4", "C4", "C4", "C4", "C4", "C4", "D4", "D4", "D4", "D4", "E4", "D4", "C4"],
  },
  {
    id: "mary",
    title: "Mary Had a Little Lamb",
    notes: ["E4", "D4", "C4", "D4", "E4", "E4", "E4", "D4", "D4", "D4", "E4", "G4", "G4", "E4", "D4", "C4", "D4", "E4", "E4", "E4", "E4", "D4", "D4", "E4", "D4", "C4"],
  },
  {
    id: "twinkle",
    title: "Twinkle Twinkle",
    notes: ["C4", "C4", "G4", "G4", "A4", "A4", "G4", "F4", "F4", "E4", "E4", "D4", "D4", "C4"],
  },
  {
    id: "ode",
    title: "Ode to Joy",
    notes: ["E4", "E4", "F4", "G4", "G4", "F4", "E4", "D4", "C4", "C4", "D4", "E4", "E4", "D4", "D4"],
  },
];
