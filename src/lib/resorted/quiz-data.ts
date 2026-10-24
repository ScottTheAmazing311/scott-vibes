import type { Key } from "./model";

/** Keys are dominant + secondary ("gr" = Gryffindor dominant, Ravenclaw secondary). */
export type Blend = { name: string; description: string; strength: string; watchFor: string };

export const blends: Record<string, Blend> = {
  gr: {
    name: "The Crusader",
    description: "Bold action for a code. When a principle is at stake, nothing slows you down.",
    strength: "You fight for what’s right while others are still deciding.",
    watchFor: "Self-righteousness. Gut and principle together leave little room for doubt.",
  },
  gh: {
    name: "The Protector",
    description: "Boldness aimed at your people. When one of them is in trouble, you’re already on your way.",
    strength: "People feel safe when you’re around.",
    watchFor: "Rescuing people who didn’t ask, and starting fights for people who didn’t want one.",
  },
  gs: {
    name: "The Maverick",
    description: "Big swings with a plan behind them. It looks reckless, but you know the odds.",
    strength: "You turn bold ideas into actual wins.",
    watchFor: "Talking yourself into whatever you already wanted to do.",
  },
  rg: {
    name: "The Reformer",
    description: "Code first, and willing to fight for it. You take on whoever breaks the rules.",
    strength: "You’ll stand up and say it out loud.",
    watchFor: "Treating every disagreement as a moral failure.",
  },
  rh: {
    name: "The Steward",
    description: "Principles held for people. Your rules exist to protect someone.",
    strength: "Fair and kind at once.",
    watchFor: "Moralizing, and holding people to your standard for their own good.",
  },
  rs: {
    name: "The Architect",
    description: "Systems with strategy behind them. You design the structure and know how it plays out.",
    strength: "You build things that work and keep working.",
    watchFor: "Coldness. People can start to feel like variables.",
  },
  hg: {
    name: "The Champion",
    description: "People first, and you’ll fight for them.",
    strength: "Your people never wonder whether you’ll show up.",
    watchFor: "Your people can do no wrong, and outsiders get the heat.",
  },
  hr: {
    name: "The Keeper",
    description: "People first, with a firm sense of how things are done. You remember the birthdays and keep the traditions.",
    strength: "You make groups feel like families.",
    watchFor: "Guilt as a tool, and rigidity about “how we do things here.”",
  },
  hs: {
    name: "The Diplomat",
    description: "People first, and you read the room like a strategist.",
    strength: "You can get almost anyone to the table.",
    watchFor: "Managing people instead of being honest with them.",
  },
  sg: {
    name: "The Operator",
    description: "Plan first, then move fast.",
    strength: "Nobody gets more done under pressure.",
    watchFor: "Letting the plan justify the collateral damage.",
  },
  sr: {
    name: "The Tactician",
    description: "Strategy inside the rules, or at least their exact wording.",
    strength: "Clean wins that hold up.",
    watchFor: "Loopholes. Technically right can still be wrong.",
  },
  sh: {
    name: "The Broker",
    description: "Strategy for the group. You find the deal that works for everyone, or close enough.",
    strength: "Teams work better with you in them.",
    watchFor: "Deciding what’s best for people without asking them.",
  },
};

export const relations: Record<"heart" | "head" | "self" | "beyond" | "tension", string> = {
  heart: "Both your top drivers decide by feel.",
  head: "Both your top drivers decide by analysis.",
  self: "Both your top drivers answer to you. You lead easily and don’t love being led.",
  beyond: "Both your top drivers answer to something bigger. You’re the steady one.",
  tension: "Your top two sit on opposite corners of the map, so you feel the pull between them.",
};

export type Question = { id: number; prompt: string; options: Record<Key, string> };

export const questions: Question[] = [
  {
    id: 1,
    prompt: "When a big decision is on the line, you trust…",
    options: {
      g: "My gut. If it feels right, I go.",
      r: "My principles. Some things aren’t up for debate.",
      h: "The people it affects. They come first.",
      s: "The likely outcomes. I play it forward.",
    },
  },
  {
    id: 2,
    prompt: "It’s 11 p.m., the group project is due at 9 a.m., and the plan isn’t working. You…",
    options: {
      g: "Take the wheel and push through. We’ll figure it out as we go.",
      r: "Go back to the assignment and find exactly where we drifted from it.",
      h: "Check on the team first. A group that’s falling apart won’t finish anything.",
      s: "Cut scope. Figure out what actually gets graded and win there.",
    },
  },
  {
    id: 3,
    prompt: "Which compliment would mean the most?",
    options: {
      g: "“You’re the one who actually did something.”",
      r: "“You’re the most honest person I know.”",
      h: "“I always feel better after talking to you.”",
      s: "“You always see the angle nobody else does.”",
    },
  },
  {
    id: 4,
    prompt: "Which kind of story hooks you hardest?",
    options: {
      g: "An underdog charging in against impossible odds.",
      r: "A detective following the evidence wherever it leads.",
      h: "A found family that sticks together no matter what.",
      s: "A heist where the plan is always three steps ahead.",
    },
  },
  {
    id: 5,
    prompt: "Your first month on a new team, you…",
    options: {
      g: "Volunteer for the hardest, most visible project.",
      r: "Learn how things are supposed to work before changing anything.",
      h: "Get coffee with everyone and learn who’s who.",
      s: "Figure out who has real influence and what they care about.",
    },
  },
  {
    id: 6,
    prompt: "A friend asks you to cover for them with their boss.",
    options: {
      g: "Sure. If it blows up, I’ll take the heat with them.",
      r: "I won’t lie for them, but I’ll help them fix it.",
      h: "Of course. They’d do the same for me.",
      s: "Find out what’s at stake and look for a version that doesn’t need a lie.",
    },
  },
  {
    id: 7,
    prompt: "Under real pressure, you tend to…",
    options: {
      g: "Move fast. Doing something beats freezing.",
      r: "Slow down and stick to the process.",
      h: "Find my people and steady them.",
      s: "Get quiet and look for the leverage point.",
    },
  },
  {
    id: 8,
    prompt: "Which criticism stings because there’s some truth in it?",
    options: {
      g: "“You jump before you think.”",
      r: "“You’d rather be right than be kind.”",
      h: "“You’d rather keep the peace than tell the truth.”",
      s: "“You can justify anything that gets you what you want.”",
    },
  },
  {
    id: 9,
    prompt: "Two friends are fighting, and both want you on their side.",
    options: {
      g: "Tell them both exactly what I think, right now.",
      r: "Work out who’s actually in the wrong and say so.",
      h: "Stay close to both and try to bring them back together.",
      s: "Stay neutral in public and talk to each one privately.",
    },
  },
  {
    id: 10,
    prompt: "What frustrates you most on a team?",
    options: {
      g: "People who talk for an hour and never do anything.",
      r: "People who cut corners and call it being flexible.",
      h: "People who treat others like they’re disposable.",
      s: "People who work hard on the wrong thing.",
    },
  },
  {
    id: 11,
    prompt: "Planning a trip, you…",
    options: {
      g: "Book the flight and figure out the rest when I land.",
      r: "Build an itinerary and actually stick to it.",
      h: "Plan whatever lets the whole group have a good time.",
      s: "Optimize it: points, off-season prices, the smartest routing.",
    },
  },
  {
    id: 12,
    prompt: "A rule at work seems pointless.",
    options: {
      g: "Break it, and own it if anyone asks.",
      r: "Follow it while I formally push to change it.",
      h: "Follow it if breaking it could get a coworker in trouble.",
      s: "Work around it where it matters and comply where it’s watched.",
    },
  },
  {
    id: 13,
    prompt: "A stranger is being treated unfairly in public.",
    options: {
      g: "Step in immediately.",
      r: "Say clearly what’s wrong, and report it if it comes to that.",
      h: "Go stand next to the person so they aren’t alone.",
      s: "Read the situation, then make the move most likely to work.",
    },
  },
  {
    id: 14,
    prompt: "Learning something new, like golf or guitar, you…",
    options: {
      g: "Jump in and play. I learn by failing.",
      r: "Learn the fundamentals properly before anything else.",
      h: "Learn it with friends. It’s better together.",
      s: "Find the 20% of skills that gets 80% of the results.",
    },
  },
  {
    id: 15,
    prompt: "You notice a mistake in your favor that nobody else caught.",
    options: {
      g: "Call it out myself. I’d rather face it head-on.",
      r: "Correct it, even if it costs me. Right is right.",
      h: "Fix it if anyone else could take the blame for it.",
      s: "If it’s small and harmless, let it ride.",
    },
  },
  {
    id: 16,
    prompt: "A friend shows you a business plan you think will fail.",
    options: {
      g: "Tell them to go for it. Nobody wins by playing it safe.",
      r: "Walk them through exactly where the numbers don’t add up.",
      h: "Support them, and gently ask a few questions.",
      s: "Help them find the version of the idea that could actually work.",
    },
  },
  {
    id: 17,
    prompt: "What would you most want said about you at the end?",
    options: {
      g: "“They went for it.”",
      r: "“They never compromised what they believed.”",
      h: "“They were always there for us.”",
      s: "“They built something that lasted.”",
    },
  },
  {
    id: 18,
    prompt: "Halfway through a board game, someone notices a rule was broken three turns ago.",
    options: {
      g: "Doesn’t matter. Keep rolling. I’m winning either way.",
      r: "Rewind and fix it. Otherwise what are we even playing?",
      h: "Let’s not fight about it. Whatever keeps the night fun.",
      s: "Quietly check who the mistake helped before I pick a side.",
    },
  },
  {
    id: 19,
    prompt: "Your friends are planning something you don’t want to do.",
    options: {
      g: "Pitch something better and rally people to it.",
      r: "Say plainly that it’s not for me, and sit it out.",
      h: "Go anyway. Being together matters more than the plan.",
      s: "Quietly steer the plan until it’s something I’d enjoy.",
    },
  },
  {
    id: 20,
    prompt: "Which would bother you most to be called?",
    options: {
      g: "A coward.",
      r: "A hypocrite.",
      h: "Selfish.",
      s: "Naive.",
    },
  },
  {
    id: 21,
    prompt: "In an argument, you’re most likely to…",
    options: {
      g: "Press harder. I believe what I’m saying.",
      r: "Point to the fact or principle that settles it.",
      h: "Back off if it’s starting to hurt the relationship.",
      s: "Concede small points to win the one that matters.",
    },
  },
  {
    id: 22,
    prompt: "The leader you’d follow anywhere…",
    options: {
      g: "Leads from the front and takes the first hit.",
      r: "Is fair, consistent, and the same in private as in public.",
      h: "Knows everyone’s name and actually cares.",
      s: "Always seems to have a plan B.",
    },
  },
  {
    id: 23,
    prompt: "You’re losing a game badly.",
    options: {
      g: "Go all-in on a long shot. Might as well.",
      r: "Play it out properly. How you lose matters.",
      h: "Honestly fine. I’m just glad we’re all playing.",
      s: "Cut a deal with someone to stay alive.",
    },
  },
  {
    id: 24,
    prompt: "You get an unexpected $5,000.",
    options: {
      g: "Finally do the thing I keep talking about.",
      r: "Follow the plan I already have for money like this.",
      h: "Treat the people who’ve helped me.",
      s: "Put it somewhere it will grow.",
    },
  },
  {
    id: 25,
    prompt: "An alarm goes off in a crowded building.",
    options: {
      g: "I’m moving before I’ve finished thinking about it.",
      r: "Follow the procedure: nearest exit, then the meeting point.",
      h: "Find the people I’m responsible for.",
      s: "Figure out the fastest safe route and get people onto it.",
    },
  },
  {
    id: 26,
    prompt: "Most of your regrets come from times you…",
    options: {
      g: "Jumped in too fast.",
      r: "Were too rigid or too harsh.",
      h: "Said yes when you meant no.",
      s: "Treated people like pieces in a plan.",
    },
  },
  {
    id: 27,
    prompt: "Your favorite part of a team win is…",
    options: {
      g: "The moment I made the big play.",
      r: "Knowing we won it the right way.",
      h: "Celebrating with everyone afterward.",
      s: "Watching the plan come together.",
    },
  },
  {
    id: 28,
    prompt: "Someone you trust lets you down.",
    options: {
      g: "Confront them about it right away.",
      r: "Decide what’s fair. They need to own it.",
      h: "Try to understand why, and forgive, maybe too quickly.",
      s: "Remember it, and adjust how much I rely on them.",
    },
  },
];

/** The quick quiz: 12 simpler questions, one pick each. Written so kids can take it too. */
export const quickQuestions: Question[] = [
  {
    id: 101,
    prompt: "You have to decide something fast. You…",
    options: {
      g: "Go with my gut and jump in.",
      r: "Think about what the right thing is.",
      h: "Think about how everyone will feel.",
      s: "Think about what will work best.",
    },
  },
  {
    id: 102,
    prompt: "On a group project, you’re the one who…",
    options: {
      g: "Gets everyone started.",
      r: "Makes sure we follow the instructions.",
      h: "Makes sure everyone gets a turn.",
      s: "Finds the smartest way to do it.",
    },
  },
  {
    id: 103,
    prompt: "A kid is getting teased at recess. You…",
    options: {
      g: "Walk right over and tell them to stop.",
      r: "Tell a teacher. It’s against the rules.",
      h: "Go sit with the kid who got teased.",
      s: "Think of a clever way to make it stop.",
    },
  },
  {
    id: 104,
    prompt: "Your friend breaks a rule in a game and nobody notices. You…",
    options: {
      g: "Don’t care. Let’s keep playing!",
      r: "Say something. Rules are rules.",
      h: "Let it go so nobody gets upset.",
      s: "Keep quiet, but remember it for later.",
    },
  },
  {
    id: 105,
    prompt: "What would make you proudest?",
    options: {
      g: "Trying something nobody else was brave enough to try.",
      r: "Being the one everyone trusts to be fair.",
      h: "Being a really good friend.",
      s: "Winning because I had the best plan.",
    },
  },
  {
    id: 106,
    prompt: "You get a giant building set. You…",
    options: {
      g: "Dump it out and start building.",
      r: "Follow the instructions step by step.",
      h: "Build it with a friend or my family.",
      s: "Sort the pieces first so it goes faster.",
    },
  },
  {
    id: 107,
    prompt: "Your brother or sister wants the last cookie too. You…",
    options: {
      g: "Grab it first!",
      r: "Split it exactly in half.",
      h: "Let them have it.",
      s: "Trade it for something I want more.",
    },
  },
  {
    id: 108,
    prompt: "Your team is losing at halftime. You…",
    options: {
      g: "Play harder and go for the big shot.",
      r: "Stick to the plan the coach gave us.",
      h: "Cheer up the teammates who feel bad.",
      s: "Figure out what the other team is doing and change our plan.",
    },
  },
  {
    id: 109,
    prompt: "What bugs you the most?",
    options: {
      g: "Waiting around with nothing to do.",
      r: "When someone cheats.",
      h: "When someone gets left out.",
      s: "When nobody thinks ahead.",
    },
  },
  {
    id: 110,
    prompt: "You get $20 for your birthday. You…",
    options: {
      g: "Spend it on something fun right away.",
      r: "Put some in savings, like I always do.",
      h: "Buy something for someone else too.",
      s: "Save it for something bigger later.",
    },
  },
  {
    id: 111,
    prompt: "Your favorite kind of hero…",
    options: {
      g: "Charges in to save the day.",
      r: "Does the right thing, even when it’s hard.",
      h: "Never leaves a friend behind.",
      s: "Outsmarts the bad guy.",
    },
  },
  {
    id: 112,
    prompt: "When you mess up, it’s usually because you…",
    options: {
      g: "Rushed in without thinking.",
      r: "Wouldn’t bend when I should have.",
      h: "Went along with everyone else.",
      s: "Tried to be too sneaky.",
    },
  },
];
