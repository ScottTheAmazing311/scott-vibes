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
  group: string;
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
      "A Gryffindor’s first move is to trust themselves. They make the call in their gut and act on it, usually before the rest of the room has finished talking. The question they ask first is what they believe they can do, and their answer is almost always more than other people would guess.",
      "Boldness is a better root than courage because it explains the whole house, not just the highlight reel. The same setting that sends a Gryffindor toward a troll also has them smuggling a baby dragon to the top of a tower at midnight to save their own skins. They leave the Invisibility Cloak behind, get caught, and land in detention. Harry, Ron and Hermione make sense as Gryffindors through that lens. They aren’t always courageous. They are reliably bold, and sometimes recklessly so.",
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
    spot: "Speaks first. Says yes before reading the details. Tells stories that start with “so I just went for it.” Gets visibly restless when planning runs long.",
    stress: "Accelerates. Moves faster, swings bigger, gets louder. The more a situation calls for patience, the harder it is for them to give it.",
    group:
      "At best, a Gryffindor crowd is momentum: the group that starts things and won’t quit. At worst it runs on dares and hero worship, and status goes to whoever does the most reckless thing.",
    work: "Give them the mission, not the manual. Let them go first, then debrief. Don’t fight their momentum; aim it. Ask for their gut call early, because they’ll act on it anyway.",
    best: {
      who: "Harry Potter",
      text: "Can’t stand by while someone is in danger. His habit of rushing in to save people wins the war, more than once.",
    },
    worst: {
      who: "Sirius Black, at school",
      text: "Sends Snape toward a transformed werewolf as a prank. The same nerve that later breaks him out of Azkaban nearly gets a classmate killed.",
    },
    outside: "Captain Ahab is boldness with no brake: total conviction, and a ship at the bottom of the sea.",
    growth: "Borrow a code. A rule you set in advance is the brake your gut doesn’t have. Before the big swing, ask what your own principles say about it.",
    misread: "“Gryffindors are the good guys.” Boldness has no built-in direction. The nerve that faces a dragon is the same nerve that hexes a classmate for laughs.",
    sig: {
      best: "Courage",
      flaw: "Recklessness",
      hurts: "Bullying; dragging others into risk",
      stress: "Accelerates",
      mono: "Buys everything, ignores the rule break",
    },
    low: "You may wait too long for certainty. Sometimes the right move is to go before the plan is finished.",
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
      "A Ravenclaw decides by consulting a system. Rules, methods, principles, a worldview: the code comes first and the decision follows from it. They build study plans and stick to them. They are disciplined, regimented, and hard to talk out of something they’ve reasoned their way into.",
      "The code doesn’t have to be school rules. It can be professional, ethical, political, religious, or entirely homemade. Luna Lovegood ignores nearly everyone’s rules, but she follows her own worldview with complete integrity and doesn’t care who laughs. That makes her a Ravenclaw, and grades have nothing to do with it. Intelligence is a tool every house uses. A Ravenclaw is defined by needing the world to make sense inside a framework, and by staying loyal to that framework when it costs them.",
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
    spot: "Has a system for everything: the budget, the packing list, the training plan. Quotes the actual rule. Gets uneasy at “it depends.” Asks what the principle is before deciding what to do.",
    stress: "Tightens. More procedure, more precision, less give. When the world gets chaotic, they hold on harder to the code.",
    group:
      "At best, a Ravenclaw crowd keeps everyone honest with real standards and real rigor. At worst it runs purity tests, splits over doctrine, and looks down on anyone who hasn’t read the source material.",
    work: "Explain the why, not just the what. Be consistent, and don’t promise what you won’t deliver. If you need them to bend, give them a principle that allows it; pressure alone makes them dig in.",
    best: {
      who: "Luna Lovegood",
      text: "Holds to her own convictions in front of a whole school that mocks her for them, and never trades them for approval.",
    },
    worst: {
      who: "Percy Weasley",
      text: "Chooses the Ministry’s rules and his own career over his family, and cuts them off for years.",
    },
    outside:
      "Atticus Finch and Inspector Javert run on the same driver. One holds to the law when his whole town turns on him. The other hunts a reformed man for decades because the law says so.",
    growth: "Borrow boldness. Some decisions have no rule that covers them. Make the call anyway, and own it.",
    misread:
      "“Ravenclaws are the smart ones.” Smart people are everywhere; Hermione, Snape and Dumbledore were all brilliant. Ravenclaws are the principled ones, whatever their principle happens to be.",
    sig: {
      best: "Integrity",
      flaw: "Rigidity",
      hurts: "Harsh judgment; condescension",
      stress: "Tightens",
      mono: "Insists the turn be replayed",
    },
    low: "Your principles may bend more than you realize. A few rules set in advance protect you from your own rationalizing.",
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
      "A Hufflepuff’s decisions run through other people. Before they ask what’s right or what works, they ask who gets hurt, who gets left out, and what this will do to the relationship. Loyalty, fairness and hard work, the classic Hufflepuff traits, are all things relationship-driven people do for their people.",
      "That orientation makes them the people everyone trusts. It also makes them the easiest house to steer, and the house most likely to go along when their group goes wrong. The usual framing gives Hufflepuff only gentle flaws, like being a pushover. The honest version has teeth: a loyal group can cover for almost anything.",
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
    spot: "Remembers your kids’ names. Notices who hasn’t said anything yet. Says “I’m fine with whatever” and mostly means it. Apologizes for things that aren’t their fault. Is usually the one hosting.",
    stress: "Tends the group and swallows their own needs, right up until the resentment comes out sideways.",
    group:
      "At best, Hufflepuffs build the strongest culture in any building, where nobody gets left behind. At worst they form cliques, close ranks, and protect their own over the truth.",
    work: "Ask how they’re doing and wait for the real answer. Give them explicit permission to disagree. Never use their loyalty as leverage; they’ll notice eventually, and they won’t forget.",
    best: {
      who: "Cedric Diggory",
      text: "Repays Harry’s dragon warning with the clue to the golden egg, then tries to hand Harry the win at the end of the maze. His courage runs on fairness to other people.",
    },
    worst: {
      who: "Remus Lupin",
      text: "Stays quiet while his friends bully a classmate, and hides that Sirius is an Animagus from Dumbledore, all to avoid losing people he loves.",
    },
    outside:
      "Narcissa Malfoy shows both directions in one person. She backs a monstrous cause for years because it’s her family’s world, then lies to Voldemort’s face to protect her son.",
    growth: "Borrow strategy. Ask what your kindness is actually achieving, and who benefits when you avoid the fight.",
    misread:
      "“Hufflepuffs are the nice ones,” or worse, the leftovers. Their shadow is as real as anyone’s. Closing ranks around a friend who did something wrong is a Hufflepuff move.",
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
      "A Slytherin decides by playing the situation forward. What are the options, where does each one lead, and which gets the result they want? Cunning and ambition are what strategy looks like from the outside, but the driver underneath is neutral. Strategic people are resourceful, inventive and calculated, and they’re at their best when the pressure is highest.",
      "The same analysis can produce a courageous act or a selfish one. A strategist can calculate their way into a sacrifice, or into a rationalization that makes anything feel justified. That’s why a Slytherin is exactly as good as their goal.",
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
    spot: "Asks “what’s the play?” Always has a plan B. Reads incentives the way other people read faces. Negotiates by reflex. Stays quiet until they move, then moves all at once.",
    stress: "Gets quiet and calculating. Looks for leverage, cuts losses fast, and sometimes the losses are people.",
    group:
      "At best, a Slytherin crowd is the most effective team in a crisis. At worst it turns cutthroat and paranoid, with everyone working an angle on everyone else.",
    work: "Make the goal clear and shared, so their strategy works for it. Be open about incentives; they’ll find them anyway. Respect competence, and give them hard problems instead of busywork.",
    best: {
      who: "Regulus Black",
      text: "Works out the secret behind Voldemort’s power, plans a way to undermine it, and walks knowingly to his own death to carry it out.",
    },
    worst: {
      who: "Lord Voldemort",
      text: "The same machinery aimed entirely at himself. Every plan, every alliance and every person is a means to his own survival.",
    },
    outside:
      "Odysseus and Littlefinger run on the same engine. One schemes his way home to his family. The other schemes his way up the ladder and lets the kingdom burn to keep climbing.",
    growth: "Borrow relationships. Ask who pays for the plan, and whether you could explain it to their face.",
    misread:
      "“Slytherins are the bad ones.” Strategy doesn’t pick a side. The ones who aim it at something bigger than themselves are some of the bravest people in the story.",
    sig: {
      best: "Resourcefulness",
      flaw: "Rationalization",
      hurts: "Manipulation; ruthlessness",
      stress: "Calculates",
      mono: "Keeps the sticky $500 quiet",
    },
    low: "You may act without playing it forward. Ask where this leads three moves from now.",
  },
};
