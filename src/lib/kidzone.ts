// Kid Zone registry + game data. To add a game: add an entry here, a route at
// src/app/kidzone/<slug>/page.tsx, and a component in src/components/kidzone/.
// To add trivia questions, flash card decks, or piano songs, just edit the data.

export interface KidGame {
  slug: string;
  title: string;
  emoji: string;
  blurb: string;
  /** card accent color */
  color: string;
}

export const kidGames: KidGame[] = [
  { slug: "trivia", title: "Trivia Blast", emoji: "🧠", blurb: "Animals, space, and brain teasers. Can you get three stars?", color: "#FFD166" },
  { slug: "dash", title: "Shape Dash", emoji: "🟧", blurb: "Jump the spikes! How far can you run?", color: "#EF476F" },
  { slug: "piano", title: "Piano Lab", emoji: "🎹", blurb: "Play for real, or learn a song note by note.", color: "#06D6A0" },
  { slug: "cards", title: "Flash Cards", emoji: "⚡", blurb: "Math facts and sight words, one flip at a time.", color: "#7F9CF5" },
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
  emoji: string;
  questions: TriviaQuestion[];
}

export const triviaCategories: TriviaCategory[] = [
  {
    id: "animals",
    title: "Amazing Animals",
    emoji: "🦁",
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
    emoji: "🚀",
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
    emoji: "🧩",
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
  emoji: string;
  cards: { front: string; back: string }[];
}

export const flashDecks: FlashDeck[] = [
  {
    id: "add",
    title: "Addition",
    emoji: "➕",
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
    emoji: "✖️",
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
    emoji: "📖",
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
