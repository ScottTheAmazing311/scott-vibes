import type { Key } from "./model";

/** Four classic capacities, shown as one row per house. */
export type Capacity = { title: string } & Record<Key, string>;

export const capacities: Capacity[] = [
  {
    title: "Courage",
    g: "Charging in first, before anyone else moves.",
    r: "Standing alone on principle when the room disagrees.",
    h: "Staying with someone when it would be easier to leave.",
    s: "The calculated sacrifice: knowing the cost and paying it.",
  },
  {
    title: "Intelligence",
    g: "Quick instinct. Reading the moment and acting in the same second.",
    r: "Depth and mastery. Knowing a subject all the way down.",
    h: "Emotional intelligence. Knowing what someone needs before they say it.",
    s: "Strategic intelligence. Seeing three moves ahead.",
  },
  {
    title: "Loyalty",
    g: "Fighting for your side.",
    r: "Loyalty to a cause or a principle.",
    h: "Loyalty to particular people.",
    s: "Loyalty to the long game, even when no one can see it.",
  },
  {
    title: "Ambition",
    g: "To prove yourself, and to be the one who did it.",
    r: "To master something and get it exactly right.",
    h: "To build something for the people around you.",
    s: "To win, and to hold the position you won.",
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
      "Two hours in, someone realizes a player collected $200 twice when passing Go. Meanwhile the Slytherin notices an extra $500 stuck to his cash from the last time he made change at the bank.",
    seats: {
      g: "Has bought every property he landed on, sure he’ll win. The rule break? “Doesn’t matter. Keep rolling. I’m winning this either way.”",
      r: "Won’t bend. The turn has to be replayed. He points out that the whole design of the game depends on the rules as written, and that the house rule everyone’s been using isn’t in the box.",
      h: "Just happy to be playing. To end the argument he offers to cover the difference out of his own stack. “It’s just a game. We’re here to hang out.”",
      s: "Has already talked the Hufflepuff into ganging up on the Gryffindor. Stays quiet about the error, since it helped him. Keeps the sticky $500, reasoning that it could have happened to anyone and who knows who else has been getting extra. “It’s just a game, anyway.”",
    },
    note: [
      "Same words, opposite drivers",
      "The Hufflepuff and the Slytherin both say “it’s just a game.” For one it’s a reason to stop fighting. For the other it’s a reason the rules don’t apply.",
    ],
  },
  {
    title: "The stalemate",
    setup:
      "Three hours in. Everyone owns a few properties, nobody has a monopoly, and the game could go all night. Here’s each house at its best.",
    seats: {
      g: "Makes the lopsided trade nobody else will. It might cost him the game, but it breaks the deadlock. Without him, the game never ends.",
      r: "Knows the official rules: an unbought property goes to auction, and Free Parking pays nothing. Those skipped rules are exactly why the game drags. Rigid, and right.",
      h: "Notices the player who’s nearly broke and has checked out, and pulls them back into the game. The night stays fun because he’s watching the table, not the board.",
      s: "Brokers a three-way deal where two other players come out ahead too. Suddenly the game is interesting again.",
    },
    note: ["Every seat matters", "Each house has a move the table needs. Take any one of them away and the game gets worse."],
  },
  {
    title: "Game over",
    setup: "Someone finally wins. How each house takes the ending says as much as how they played.",
    seats: {
      g: "Lost? Demands a rematch before the money is back in the box. Won? You’ll hear about it for weeks.",
      r: "Lost? Accepts it, because it was played correctly. Won? Only counts it if it was clean.",
      h: "Lost? Genuinely fine, because the evening was the point. Won? Feels a little bad about bankrupting a friend.",
      s: "Lost? Replays every trade on the drive home. Won? Already knows exactly which move did it.",
    },
    note: ["Losing is the tell", "The ending reveals the driver most clearly. It’s the moment each house finds out what it actually wanted."],
  },
];

export type Scenario = { title: string } & Record<Key, string>;

export const scenarios: Scenario[] = [
  {
    title: "One person on your team has to be cut.",
    g: "Marches into leadership to fight it, possibly before checking whether there’s a fight to win.",
    r: "Insists on a fair, written standard and applies it, even if it lands on a friend.",
    h: "Agonizes over who has a family to support, and might offer to go themselves.",
    s: "Asks what leadership is really trying to save, and comes back with an option nobody considered.",
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
    g: "Picks a direction and moves. Momentum feels like progress.",
    r: "Follows the survival rules: stop, stay put, stay warm, stay visible.",
    h: "Keeps the group calm and together, and makes sure nobody wanders off alone.",
    s: "Climbs for a vantage point and takes inventory: water, light, phone battery.",
  },
  {
    title: "Planning a surprise party.",
    g: "Invites sixty people and books a band. Go big.",
    r: "Builds the timeline, the guest list and the run of show, then follows it.",
    h: "Stops to ask whether the guest of honor would even want a surprise.",
    s: "Engineers the decoy plan that gets them through the door without a clue.",
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
    text: "Two self-directed houses that both want to lead. One goes by gut, the other by plan, so they respect each other’s nerve and distrust each other’s methods. It’s the central rivalry of the books for a reason. Aimed at the same goal, nobody stops them.",
  },
  {
    a: "g",
    b: "h",
    kind: "Heart allies",
    share: "Both decide by feel",
    diagonal: false,
    text: "The Gryffindor charges in and the Hufflepuff makes sure nobody gets left behind. Friction comes when the Gryffindor drags the Hufflepuff into risks they didn’t sign up for, or the Hufflepuff slows a charge to keep everyone comfortable.",
  },
  {
    a: "r",
    b: "s",
    kind: "Head allies",
    share: "Both decide by analysis",
    diagonal: false,
    text: "The best planning partnership on the map. The Ravenclaw asks what’s right and the Slytherin asks what works. Friction: the Slytherin thinks the Ravenclaw is naive, and the Ravenclaw thinks the Slytherin lives in the loopholes.",
  },
  {
    a: "r",
    b: "h",
    kind: "Steady allies",
    share: "Both answer to something bigger",
    diagonal: false,
    text: "One answers to a code and the other to a community. Together they’re the dependable backbone of any group. Their fight is always the same one: fairness versus mercy, and whether the rule should bend for someone they love.",
  },
  {
    a: "g",
    b: "r",
    kind: "Diagonal",
    share: "Opposite on both axes",
    diagonal: true,
    text: "Rule-breaker and rule-keeper. They share nothing, which is why the Monopoly table explodes. They also hold exactly what the other is missing: the Gryffindor needs a code, and the Ravenclaw needs nerve.",
  },
  {
    a: "h",
    b: "s",
    kind: "Diagonal",
    share: "Opposite on both axes",
    diagonal: true,
    text: "The trusting and the strategic. When the Slytherin is unhealthy, this is the most dangerous pairing on the map, because the Hufflepuff gets played. When both are healthy it’s the most powerful: one has the plan, the other has the trust of everyone needed to carry it out.",
  },
];

export type CanonEntry = { name: string; canon: Key; resorted: Key; secondary: Key | null; why: string };

export const canon: CanonEntry[] = [
  {
    name: "Harry Potter",
    canon: "g",
    resorted: "g",
    secondary: "h",
    why: "Acts first, and nearly always on someone else’s behalf. His saving-people habit is boldness aimed at his friends.",
  },
  {
    name: "Hermione Granger",
    canon: "g",
    resorted: "r",
    secondary: "g",
    why: "Study plans, the rulebook, and a whole campaign for house-elf rights. A code first, with enough nerve to break rules when her code demands it.",
  },
  {
    name: "Ron Weasley",
    canon: "g",
    resorted: "h",
    secondary: "g",
    why: "Family, friends and where he stands with them drive almost every big choice, including his worst one: walking out on Harry and Hermione.",
  },
  {
    name: "Neville Longbottom",
    canon: "g",
    resorted: "g",
    secondary: "h",
    why: "Barely bold at eleven and leading a resistance at seventeen. His nerve grew, and it was always pointed at protecting other people.",
  },
  {
    name: "Cedric Diggory",
    canon: "h",
    resorted: "h",
    secondary: "g",
    why: "Brave in the tournament, but the driver was fairness to others. He repaid Harry’s dragon warning and tried to hand him the cup.",
  },
  {
    name: "Luna Lovegood",
    canon: "r",
    resorted: "r",
    secondary: null,
    why: "Her code is homemade and she never flinches from it. Proof that Ravenclaw is about principle, not grades.",
  },
  {
    name: "Percy Weasley",
    canon: "g",
    resorted: "r",
    secondary: null,
    why: "Picks the Ministry’s rules over his own family. The code-driven shadow in its purest form.",
  },
  {
    name: "Minerva McGonagall",
    canon: "g",
    resorted: "r",
    secondary: "g",
    why: "Fair enough to take fifty points per student from her own house, with the nerve to duel when it counts.",
  },
  {
    name: "Albus Dumbledore",
    canon: "g",
    resorted: "s",
    secondary: "g",
    why: "Plans decades ahead, withholds what people need to know, and spends years preparing Harry for a sacrifice. “For the greater good” is a strategist’s line.",
  },
  {
    name: "Severus Snape",
    canon: "s",
    resorted: "s",
    secondary: "h",
    why: "Years as a double agent, with every move in service of one relationship.",
  },
  {
    name: "Regulus Black",
    canon: "s",
    resorted: "s",
    secondary: null,
    why: "Works out Voldemort’s secret and calculates his own death into the plan to undermine it.",
  },
  {
    name: "Draco Malfoy",
    canon: "s",
    resorted: "h",
    secondary: "s",
    why: "Nearly every choice protects his family’s standing and safety. Loyalty to a circle that’s wrong is a Hufflepuff shadow.",
  },
  {
    name: "Narcissa Malfoy",
    canon: "s",
    resorted: "h",
    secondary: null,
    why: "Backs a monstrous cause because it’s her family’s world, then lies to Voldemort’s face for her son.",
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
    why: "Stays quiet while his friends bully a classmate and hides their secret from Dumbledore, all to keep the people he loves.",
  },
  {
    name: "Sirius Black",
    canon: "g",
    resorted: "g",
    secondary: null,
    why: "Pure boldness in both directions: the godfather who escapes Azkaban, and the teenager whose prank nearly killed a classmate.",
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
    why: "Attaches himself to whoever is strongest and calculates his way to survival at everyone else’s expense.",
  },
  {
    name: "Gilderoy Lockhart",
    canon: "r",
    resorted: "s",
    secondary: null,
    why: "Builds a career on other people’s achievements and wipes their memories. That’s a strategy, not a code.",
  },
  {
    name: "Dolores Umbridge",
    canon: "s",
    resorted: "s",
    secondary: null,
    why: "Lives by decrees but doesn’t believe in rules; she uses them. Rules as tools is strategy. Rules as truth is code.",
  },
  {
    name: "Lord Voldemort",
    canon: "s",
    resorted: "s",
    secondary: null,
    why: "Strategy with exactly one beneficiary.",
  },
];
