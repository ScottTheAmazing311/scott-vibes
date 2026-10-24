import type { Key } from "./model";

export type UncheckedItem = { text: string; hurtsOthers: boolean };

export type House = {
  id: string;
  name: string;
  driver: string;
  driverLong: string;
  loyal: string;
  firstQuestion: string;
  axes: string;
  def: [string, string];
  healthy: string[];
  unchecked: UncheckedItem[];
  spot: string;
  stress: string;
  work: string;
  best: { who: string; text: string };
  worst: { who: string; text: string };
  outside: string;
  growth: string;
  misread: string;
  sig: { best: string; flaw: string; hurts: string; stress: string; mono: string };
  low: string;
};

export const houses: Record<Key, House> = {
  g: {
    id: "gryffindor",
    name: "Gryffindor",
    driver: "Boldness",
    driverLong: "Boldness-driven",
    loyal: "Loyal to their own conviction",
    firstQuestion: "What do I believe I can do?",
    axes: "Heart × Self",
    def: [
      "A Gryffindor trusts their gut and acts on it, usually before the room has finished talking. Ask what they can do and they’ll guess higher than you would.",
      "Boldness explains more than courage does. It sends Harry at a troll. It also has him hauling a baby dragon up a tower at midnight, leaving the Cloak behind, and landing in detention. The trio isn’t always courageous. They’re always bold.",
    ],
    healthy: ["Courage", "Decisiveness", "Initiative", "Optimism", "Resilience after failure", "Standing up for others"],
    unchecked: [
      { text: "Recklessness", hurtsOthers: false },
      { text: "Overconfidence", hurtsOthers: false },
      { text: "Impatience", hurtsOthers: false },
      { text: "Arrogance", hurtsOthers: true },
      { text: "Dragging others into risk", hurtsOthers: true },
      { text: "Bullying for sport", hurtsOthers: true },
    ],
    spot: "Speaks first. Says yes before reading the details. Gets restless when planning runs long.",
    stress: "Speeds up. The more a situation needs patience, the less they have.",
    work: "Give them the mission and let them go first. Ask for their gut call early, because they’ll act on it anyway.",
    best: {
      who: "Harry Potter",
      text: "Can’t stand by while someone is in danger. Rushing in to save people wins the war.",
    },
    worst: {
      who: "Sirius Black, at school",
      text: "Sends Snape toward a werewolf as a prank. The nerve that later gets him out of Azkaban nearly gets a classmate killed.",
    },
    outside: "Captain Ahab: total conviction, and a ship at the bottom of the sea.",
    growth: "Borrow a code. A rule set in advance is the brake your gut doesn’t have.",
    misread: "“Gryffindors are the good guys.” Boldness has no direction. The nerve that faces a dragon also hexes a classmate for laughs.",
    sig: {
      best: "Courage",
      flaw: "Recklessness",
      hurts: "Bullying; dragging others into risk",
      stress: "Speeds up",
      mono: "Buys everything, ignores the rule break",
    },
    low: "You may wait too long for certainty. Sometimes you have to go before the plan is done.",
  },
  r: {
    id: "ravenclaw",
    name: "Ravenclaw",
    driver: "Code",
    driverLong: "Code-driven",
    loyal: "Loyal to the principle",
    firstQuestion: "What does the code say is right?",
    axes: "Head × Beyond self",
    def: [
      "A Ravenclaw decides by checking a system. It might be rules, a method or a worldview. They make study plans and keep them, and they’re hard to argue out of a conclusion.",
      "The code doesn’t have to be the school’s. Luna ignores most people’s rules and follows her own worldview completely, whoever laughs. That makes her a Ravenclaw. Her grades don’t.",
    ],
    healthy: ["Integrity", "Discipline", "Fairness", "Consistency", "Mastery", "Building systems and worlds"],
    unchecked: [
      { text: "Rigidity", hurtsOthers: false },
      { text: "Stubbornness", hurtsOthers: false },
      { text: "Emotional detachment", hurtsOthers: false },
      { text: "Freezing when no rule fits", hurtsOthers: false },
      { text: "Harsh judgment", hurtsOthers: true },
      { text: "Condescension", hurtsOthers: true },
      { text: "The letter over the spirit", hurtsOthers: true },
    ],
    spot: "Has a system for the budget, the packing list and the training plan. Quotes the actual rule. Gets uneasy at “it depends.”",
    stress: "Tightens. More procedure, less give.",
    work: "Explain why. Be consistent. If you need them to bend, give them a principle that allows it, because pressure makes them dig in.",
    best: {
      who: "Luna Lovegood",
      text: "Keeps her convictions while the whole school mocks her for them.",
    },
    worst: {
      who: "Percy Weasley",
      text: "Picks the Ministry and his career over his family, and cuts them off for years.",
    },
    outside:
      "Atticus Finch and Javert share the driver. One holds to the law when his town turns on him. The other hunts a reformed man for decades because the law says to.",
    growth: "Borrow boldness. When no rule covers it, make the call and own it.",
    misread: "“Ravenclaws are the smart ones.” Hermione, Snape and Dumbledore were all brilliant. Ravenclaws are the principled ones, whatever the principle.",
    sig: {
      best: "Integrity",
      flaw: "Rigidity",
      hurts: "Harsh judgment; condescension",
      stress: "Tightens",
      mono: "Insists the turn be replayed",
    },
    low: "Your principles may bend more than you think. A few rules set in advance protect you from your own excuses.",
  },
  h: {
    id: "hufflepuff",
    name: "Hufflepuff",
    driver: "Relationships",
    driverLong: "Relationship-driven",
    loyal: "Loyal to the people",
    firstQuestion: "Who does this affect?",
    axes: "Heart × Beyond self",
    def: [
      "A Hufflepuff decides through other people. Before asking what’s right or what works, they ask who gets hurt and what it does to the relationship. Loyalty, fairness and hard work are what that looks like.",
      "It makes them the people everyone trusts. It also makes them easy to steer, and likely to go along when their group goes wrong. A loyal group can cover for almost anything.",
    ],
    healthy: ["Empathy", "Loyalty", "Generosity", "Inclusion", "Trustworthiness", "Forgiveness"],
    unchecked: [
      { text: "People-pleasing", hurtsOthers: false },
      { text: "Conflict avoidance", hurtsOthers: false },
      { text: "Getting steamrolled", hurtsOthers: false },
      { text: "Enabling", hurtsOthers: true },
      { text: "Covering for their own", hurtsOthers: true },
      { text: "Tribalism", hurtsOthers: true },
      { text: "Guilt-tripping", hurtsOthers: true },
    ],
    spot: "Remembers your kids’ names. Notices who hasn’t spoken. Says “I’m fine with whatever” and means it. Usually the one hosting.",
    stress: "Looks after everyone else and swallows their own needs, until the resentment comes out sideways.",
    work: "Ask how they are and wait for the real answer. Tell them it’s fine to disagree. Never use their loyalty as leverage.",
    best: {
      who: "Cedric Diggory",
      text: "Repays Harry’s dragon warning with the egg clue, then tries to give Harry the win in the maze.",
    },
    worst: {
      who: "Remus Lupin",
      text: "Stays quiet while his friends bully a classmate, and hides Sirius’s secret from Dumbledore, to keep his friends.",
    },
    outside: "Narcissa Malfoy backs a monstrous cause because it’s her family’s, then lies to Voldemort’s face for her son.",
    growth: "Borrow strategy. Ask what your kindness is achieving, and who benefits when you avoid the fight.",
    misread: "“Hufflepuffs are the nice ones.” Closing ranks around a friend who did wrong is a Hufflepuff move too.",
    sig: {
      best: "Loyalty",
      flaw: "Conflict avoidance",
      hurts: "Enabling; closing ranks",
      stress: "Accommodates",
      mono: "Pays out of pocket to end the fight",
    },
    low: "You may miss what your choices cost the people around you. Ask who this affects before you decide.",
  },
  s: {
    id: "slytherin",
    name: "Slytherin",
    driver: "Strategy",
    driverLong: "Strategy-driven",
    loyal: "Loyal to the outcome",
    firstQuestion: "What gets me where I’m going?",
    axes: "Head × Self",
    def: [
      "A Slytherin plays the situation forward. What are the options, where does each lead, and which one wins? Cunning and ambition are how that looks from outside. The driver itself is neutral.",
      "The same math can produce a sacrifice or an excuse. A Slytherin is exactly as good as their goal.",
    ],
    healthy: ["Resourcefulness", "Foresight", "Calm under pressure", "Innovation", "Negotiation", "Calculated sacrifice"],
    unchecked: [
      { text: "Rationalization", hurtsOthers: false },
      { text: "Secrecy", hurtsOthers: false },
      { text: "Ends justify the means", hurtsOthers: false },
      { text: "Manipulation", hurtsOthers: true },
      { text: "Ruthlessness", hurtsOthers: true },
      { text: "Treating people as pieces", hurtsOthers: true },
    ],
    spot: "Asks “what’s the play?” Has a plan B. Reads incentives the way other people read faces. Quiet until they move.",
    stress: "Goes quiet and looks for leverage. Cuts losses fast, and sometimes the losses are people.",
    work: "Make the goal shared so their plan serves it. Be open about incentives, since they’ll find them anyway. Give them hard problems.",
    best: {
      who: "Regulus Black",
      text: "Works out Voldemort’s secret, plans to undo it, and walks to his own death to carry it out.",
    },
    worst: {
      who: "Lord Voldemort",
      text: "The same machinery aimed at himself. Every person is a means to his survival.",
    },
    outside: "Odysseus and Littlefinger share the engine. One schemes his way home. The other schemes his way up and lets the kingdom burn.",
    growth: "Borrow relationships. Ask who pays for the plan, and whether you’d explain it to their face.",
    misread: "“Slytherins are the bad ones.” Strategy doesn’t pick a side, and some of the bravest people in the story are Slytherins.",
    sig: {
      best: "Resourcefulness",
      flaw: "Rationalization",
      hurts: "Manipulation; ruthlessness",
      stress: "Calculates",
      mono: "Keeps the sticky $500 quiet",
    },
    low: "You may act without thinking ahead. Ask where this leads three moves from now.",
  },
};
