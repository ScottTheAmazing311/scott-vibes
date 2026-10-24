import type { Key } from "./model";

/** Four classic capacities, shown as one row per house. */
export type Capacity = { title: string } & Record<Key, string>;

export const capacities: Capacity[] = [
  {
    title: "Courage",
    g: "Going in first.",
    r: "Standing alone on principle.",
    h: "Staying when it would be easier to leave.",
    s: "Knowing the cost and paying it.",
  },
  {
    title: "Intelligence",
    g: "Reading the moment and acting in the same second.",
    r: "Knowing a subject all the way down.",
    h: "Knowing what someone needs before they say it.",
    s: "Seeing three moves ahead.",
  },
  {
    title: "Loyalty",
    g: "To your side.",
    r: "To a cause.",
    h: "To particular people.",
    s: "To the long game.",
  },
  {
    title: "Ambition",
    g: "To be the one who did it.",
    r: "To get it exactly right.",
    h: "To build something for your people.",
    s: "To win and stay on top.",
  },
];

export type Collision = { a: Key; b: Key; text: string };

export const collisions: Collision[] = [
  { a: "g", b: "r", text: "The fastest way through breaks a rule." },
  { a: "g", b: "h", text: "The move you believe in will upset someone you love." },
  { a: "g", b: "s", text: "Your gut says go. The math says wait." },
  { a: "r", b: "h", text: "Following the rule would hurt a friend." },
  { a: "r", b: "s", text: "The winning move is technically a loophole." },
  { a: "h", b: "s", text: "The smart play costs someone a little." },
];

export type MonopolyRound = {
  title: string;
  setup: string;
  seats: Record<Key, string>;
  note: [string, string];
};

export const monopoly: MonopolyRound[] = [
  {
    title: "The rule break",
    setup:
      "Two hours in, someone notices a player collected $200 twice passing Go. The Slytherin also has an extra $500 stuck to his cash from the bank.",
    seats: {
      g: "Has bought everything he landed on. “Doesn’t matter. Keep rolling. I’m winning anyway.”",
      r: "Wants the turn replayed, and points out that the house rule everyone’s using isn’t in the box.",
      h: "Offers to cover the difference from his own stack. “It’s just a game. We’re here to hang out.”",
      s: "Has already talked the Hufflepuff into ganging up on the Gryffindor. Says nothing about the error, since it helped him, and keeps the $500. “It’s just a game, anyway.”",
    },
    note: [
      "Same words",
      "The Hufflepuff and the Slytherin both say “it’s just a game.” One means stop fighting. The other means the rules don’t apply.",
    ],
  },
  {
    title: "The stalemate",
    setup:
      "Three hours in. Nobody has a monopoly and the game could go all night. Each house at its best.",
    seats: {
      g: "Makes the lopsided trade nobody else will. It might cost him, but it breaks the deadlock.",
      r: "Knows the real rules. Unbought property goes to auction and Free Parking pays nothing. Skipping them is why the game drags.",
      h: "Notices the player who’s nearly broke and checked out, and pulls them back in.",
      s: "Brokers a three-way deal where two other players come out ahead too.",
    },
    note: ["Every seat matters", "Take any one house away and the game gets worse."],
  },
  {
    title: "Game over",
    setup: "Someone finally wins.",
    seats: {
      g: "Lost? Demands a rematch before the money is back in the box. Won? You’ll hear about it for weeks.",
      r: "Lost? Accepts it, because it was played correctly. Won? Only counts it if it was clean.",
      h: "Lost? Fine, the evening was the point. Won? Feels bad about bankrupting a friend.",
      s: "Lost? Replays every trade on the drive home. Won? Already knows exactly which move did it.",
    },
    note: ["Losing is the tell", "The ending shows what each house actually wanted."],
  },
];

export type Scenario = { title: string } & Record<Key, string>;

export const scenarios: Scenario[] = [
  {
    title: "One person on your team has to be cut.",
    g: "Marches in to fight it, maybe before checking there’s a fight to win.",
    r: "Insists on a fair written standard, even if it lands on a friend.",
    h: "Worries about who has a family to support, and might offer to go.",
    s: "Asks what leadership is really trying to save, and finds an option nobody considered.",
  },
  {
    title: "A friend confesses they cheated on a certification exam.",
    g: "“Go tell them before it blows up. I’ll come with you.”",
    r: "“You have to report it.” Friendship doesn’t change what happened.",
    h: "“I’m not going anywhere.” At worst, keeps the secret forever.",
    s: "“Who else knows?” Then works out the realistic cost of every option.",
  },
  {
    title: "Lost on a trail with an hour of daylight left.",
    g: "Picks a direction and moves.",
    r: "Stops. Stays put, stays warm, stays visible.",
    h: "Keeps the group calm and together.",
    s: "Climbs for a view and counts the water, light and battery.",
  },
  {
    title: "Planning a surprise party.",
    g: "Invites sixty people and books a band.",
    r: "Builds the timeline and guest list, then sticks to them.",
    h: "Asks whether the guest of honor even wants a surprise.",
    s: "Plans the decoy that gets them through the door.",
  },
];

export type Pair = { a: Key; b: Key; kind: string; share: string; diagonal: boolean; text: string };

export const pairs: Pair[] = [
  {
    a: "g",
    b: "s",
    kind: "Rivals",
    share: "Both answer to themselves",
    diagonal: false,
    text: "Both want to lead. One goes by gut, the other by plan, so each respects the other’s nerve and distrusts their methods. Aimed at the same goal, nobody stops them.",
  },
  {
    a: "g",
    b: "h",
    kind: "Heart allies",
    share: "Both decide by feel",
    diagonal: false,
    text: "The Gryffindor charges in and the Hufflepuff makes sure nobody is left behind. They clash when one drags the other into risk, or the other slows the charge.",
  },
  {
    a: "r",
    b: "s",
    kind: "Head allies",
    share: "Both decide by analysis",
    diagonal: false,
    text: "The best planning pair. The Ravenclaw asks what’s right and the Slytherin asks what works. Each finds the other naive or slippery.",
  },
  {
    a: "r",
    b: "h",
    kind: "Steady allies",
    share: "Both answer to something bigger",
    diagonal: false,
    text: "A code and a community. Together they hold a group up. Their fight is always fairness against mercy.",
  },
  {
    a: "g",
    b: "r",
    kind: "Diagonal",
    share: "Opposite on both axes",
    diagonal: true,
    text: "Rule-breaker and rule-keeper. Each has what the other lacks. The Gryffindor needs a code and the Ravenclaw needs nerve.",
  },
  {
    a: "h",
    b: "s",
    kind: "Diagonal",
    share: "Opposite on both axes",
    diagonal: true,
    text: "Trust and strategy. With an unhealthy Slytherin, the Hufflepuff gets played. With two healthy ones, one has the plan and the other has everyone’s trust.",
  },
];

export type CanonEntry = { name: string; canon: Key; resorted: Key; secondary: Key | null; why: string };

export const canon: CanonEntry[] = [
  {
    name: "Harry Potter",
    canon: "g",
    resorted: "g",
    secondary: "h",
    why: "Acts first, nearly always for someone else.",
  },
  {
    name: "Hermione Granger",
    canon: "g",
    resorted: "r",
    secondary: "g",
    why: "Study plans, the rulebook and a campaign for house-elf rights. Breaks rules only when her code says to.",
  },
  {
    name: "Ron Weasley",
    canon: "g",
    resorted: "h",
    secondary: "g",
    why: "Family and friends drive his big choices, including walking out on Harry and Hermione.",
  },
  {
    name: "Neville Longbottom",
    canon: "g",
    resorted: "g",
    secondary: "h",
    why: "Timid at eleven, leading a resistance at seventeen, always to protect people.",
  },
  {
    name: "Cedric Diggory",
    canon: "h",
    resorted: "h",
    secondary: "g",
    why: "Brave, but driven by fairness. Repaid Harry’s dragon warning and tried to hand him the cup.",
  },
  {
    name: "Luna Lovegood",
    canon: "r",
    resorted: "r",
    secondary: null,
    why: "Her code is homemade and she never flinches from it.",
  },
  {
    name: "Percy Weasley",
    canon: "g",
    resorted: "r",
    secondary: null,
    why: "Picks the Ministry’s rules over his family.",
  },
  {
    name: "Minerva McGonagall",
    canon: "g",
    resorted: "r",
    secondary: "g",
    why: "Takes fifty points per student from her own house, and duels when it counts.",
  },
  {
    name: "Albus Dumbledore",
    canon: "g",
    resorted: "s",
    secondary: "g",
    why: "Plans decades ahead, keeps secrets, and prepares Harry for a sacrifice. “For the greater good” is a strategist’s line.",
  },
  {
    name: "Severus Snape",
    canon: "s",
    resorted: "s",
    secondary: "h",
    why: "Years as a double agent, all for one relationship.",
  },
  {
    name: "Regulus Black",
    canon: "s",
    resorted: "s",
    secondary: null,
    why: "Works out Voldemort’s secret and plans his own death into undoing it.",
  },
  {
    name: "Draco Malfoy",
    canon: "s",
    resorted: "h",
    secondary: "s",
    why: "Almost every choice protects his family. Loyalty to the wrong circle is a Hufflepuff shadow.",
  },
  {
    name: "Narcissa Malfoy",
    canon: "s",
    resorted: "h",
    secondary: null,
    why: "Backs a monstrous cause for her family, then lies to Voldemort for her son.",
  },
  {
    name: "Rubeus Hagrid",
    canon: "g",
    resorted: "h",
    secondary: null,
    why: "Trusts everyone, can’t keep a secret, and loves creatures that might eat you.",
  },
  {
    name: "Remus Lupin",
    canon: "g",
    resorted: "h",
    secondary: null,
    why: "Stays quiet while his friends bully a classmate, to keep them.",
  },
  {
    name: "Sirius Black",
    canon: "g",
    resorted: "g",
    secondary: null,
    why: "Escapes Azkaban for his godson. Nearly killed a classmate as a prank.",
  },
  {
    name: "Fred & George Weasley",
    canon: "g",
    resorted: "g",
    secondary: "s",
    why: "Bold to the bone, with a business plan behind the fireworks.",
  },
  {
    name: "Peter Pettigrew",
    canon: "g",
    resorted: "s",
    secondary: null,
    why: "Sticks to whoever is strongest and survives at everyone else’s expense.",
  },
  {
    name: "Gilderoy Lockhart",
    canon: "r",
    resorted: "s",
    secondary: null,
    why: "Steals other people’s achievements and wipes their memories.",
  },
  {
    name: "Dolores Umbridge",
    canon: "s",
    resorted: "s",
    secondary: null,
    why: "Uses rules without believing in them. Rules as tools is strategy. Rules as truth is code.",
  },
  {
    name: "Lord Voldemort",
    canon: "s",
    resorted: "s",
    secondary: null,
    why: "Strategy with exactly one beneficiary.",
  },
];
