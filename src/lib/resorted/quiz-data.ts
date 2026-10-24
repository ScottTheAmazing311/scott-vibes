import type { Key } from "./model";

/** Keys are dominant + secondary ("gr" = Gryffindor dominant, Ravenclaw secondary). */
export type Blend = { name: string; description: string; strength: string; watchFor: string };

export const blends: Record<string, Blend> = {
  gr: {
    name: "The Crusader",
    description:
      "Bold action in service of a code. You charge in, and you charge in for something. When a principle is at stake, nothing slows you down.",
    strength: "You’ll fight for what’s right while everyone else is still deciding whether to.",
    watchFor: "Certainty in your gut plus certainty in your principles leaves very little room for doubt. Self-righteousness is your trap.",
  },
  gh: {
    name: "The Protector",
    description: "Boldness aimed at your people. When someone you care about is in trouble, you’re already on your way.",
    strength: "People feel safe when you’re around.",
    watchFor: "Rescuing people who didn’t ask to be rescued, and starting fights on someone’s behalf without checking whether they want one.",
  },
  gs: {
    name: "The Maverick",
    description: "Big swings with a plan behind them. Your moves look reckless from the outside, but you usually know the odds.",
    strength: "You turn bold ideas into actual wins.",
    watchFor: "Ego plus rationalization. You can talk yourself into anything you already wanted to do.",
  },
  rg: {
    name: "The Reformer",
    description: "Code first, and willing to fight for it. You don’t just keep the rules; you take on whoever is breaking them.",
    strength: "Integrity with a spine. You’ll stand up and say it out loud.",
    watchFor: "Crusading over small things, and treating every disagreement as a moral failure.",
  },
  rh: {
    name: "The Steward",
    description: "Principles held for the sake of people. Your rules exist to protect someone, and you keep them faithfully.",
    strength: "Fair and kind at once, which is rarer than it sounds.",
    watchFor: "Moralizing, martyrdom, and holding people to your standard for their own good.",
  },
  rs: {
    name: "The Architect",
    description: "Systems with strategy behind them. You design the structure and you know how it will play out.",
    strength: "You build things that work and keep working.",
    watchFor: "Coldness. People can start to feel like variables in your system.",
  },
  hg: {
    name: "The Champion",
    description: "People first, and you’ll fight for them. Loyalty with a backbone.",
    strength: "Your people never wonder whether you’ll show up.",
    watchFor: "Tribal loyalty with a temper. Your people can do no wrong, and outsiders get the heat.",
  },
  hr: {
    name: "The Keeper",
    description:
      "People first, with a strong sense of how things should be done. You remember the birthdays, keep the traditions, and know the house rules.",
    strength: "You make groups feel like families.",
    watchFor: "Guilt as a tool, and rigidity about “how we do things here.”",
  },
  hs: {
    name: "The Diplomat",
    description: "People first, and you read the room like a strategist. You know what each person needs to hear.",
    strength: "You can get almost anyone to the table.",
    watchFor: "Managing people instead of being honest with them, and trading the truth for peace.",
  },
  sg: {
    name: "The Operator",
    description: "Plan first, then bold execution. You see the move and you make it, fast.",
    strength: "Results. Nobody gets more done under pressure.",
    watchFor: "Ruthlessness. The plan can start to justify the collateral damage.",
  },
  sr: {
    name: "The Tactician",
    description: "Strategy inside a framework. You play to win, and you play by the rules, or at least by their exact wording.",
    strength: "Clean wins that hold up under scrutiny.",
    watchFor: "Loopholes. Technically right and practically wrong is still wrong.",
  },
  sh: {
    name: "The Broker",
    description: "Strategy aimed at the group. You find the deal that works for everyone, or close enough.",
    strength: "You make teams more effective than they’d be on their own.",
    watchFor: "Deciding what’s best for people without asking them. Manipulation can feel like care from the inside.",
  },
};

export const relations: Record<"heart" | "head" | "self" | "beyond" | "tension", string> = {
  heart: "Both of your top drivers decide by feel. You trust instinct and people over spreadsheets.",
  head: "Both of your top drivers decide by analysis. You’d rather think it through than wing it.",
  self: "Both of your top drivers answer to you: your conviction and your goals. You lead naturally, and you don’t love being led.",
  beyond: "Both of your top drivers answer to something bigger than you, a code or a community. You’re the steady one.",
  tension:
    "Tension blend. Your top two sit on opposite corners of the map, so you feel the pull between them. It also gives you more range than most people.",
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
