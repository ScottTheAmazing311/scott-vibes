/**
 * Single source of truth for site copy and data.
 * Italic serif emphasis: wrap a phrase in *asterisks* inside any headline string.
 * Images use picsum seeds as placeholders. Swap `image.src` for real assets.
 */

export interface ImageSpec {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Entry {
  title: string;
  kind: string;
  year: string;
  href?: string;
}

export interface Domain {
  id: "theology" | "photography" | "creative" | "professional" | "other";
  number: string;
  name: string;
  path: string;
  discipline: string;
  year: string;
  /** one simple line: what this section is */
  line: string;
  /** muted background used for the home spread and hub hero */
  bg: string;
  image: ImageSpec;
  /** optional separate image for the quick-link card (falls back to image) */
  card?: ImageSpec;
  /** CSS object-position for the home spread crop, e.g. "top" | "bottom" */
  imagePos?: string;
  /** show the hub hero image uncropped at its natural aspect (default crops to 3:4) */
  imageFull?: boolean;
  entries: Entry[];
  /** optional prominent link to a deeper page */
  subpage?: { label: string; href: string };
}

export const site = {
  name: "Scott Knudson",
  domain: "scottvibes.com",
  email: "scott.knudson@gmail.com",
  availability: "Taking on select projects from October 2026", // TODO: confirm
  resumeHref: "/resume.pdf", // TODO: add the file to /public
  description:
    "The collected work of Scott Knudson: theology, photography, creative projects, professional practice, and the things that fit nowhere else.",
};

export const hero = {
  label: "Creative Portfolio of Scott Knudson",
  cta: { label: "It's down here", href: "#work" },
};

export const domains: Domain[] = [
  {
    id: "creative",
    number: "01",
    name: "Vibe Projects",
    path: "/creative",
    discipline: "Writing, code, experiments",
    year: "2020 to now",
    line: "Games, side hustles, experiments, fun things I vibe code.",
    bg: "#DCDCD6",
    image: {
      src: "/cards/creative.png",
      alt: "Grid of six apps built by Scott: Lucky Links, Swang, Ruinous, Nine Postures, Quadrants, and SlideKeep",
      width: 598,
      height: 790,
    },
    imagePos: "top",
    imageFull: true,
    entries: [
      { title: "Untitled screenplay", kind: "Screenplay", year: "2026" },
      { title: "Future fiction", kind: "Short fiction", year: "2025" },
      { title: "scottvibes.com", kind: "Website", year: "2026", href: "/" },
      { title: "Experiment 01", kind: "Software", year: "2025" },
    ],
    subpage: { label: "Open the Apps", href: "/creative/apps" },
  },
  {
    id: "photography",
    number: "02",
    name: "Photography",
    path: "/photography",
    discipline: "Street, landscape, portrait",
    year: "2015 to now",
    line: "People, places, and things. Shot on a Sony A7CII.",
    bg: "#D2D8C6",
    image: {
      src: "/cards/photography.jpg",
      alt: "Whitewater pouring through a rocky gorge",
      width: 1600,
      height: 1066,
    },
    // These match the Sanity `series` values; once photos are uploaded the
    // gallery replaces this index automatically.
    entries: [
      { title: "People", kind: "Series", year: "Ongoing" },
      { title: "Places", kind: "Series", year: "Ongoing" },
      { title: "Things", kind: "Series", year: "Ongoing" },
      { title: "Flowers", kind: "Series", year: "Ongoing" },
      { title: "B&W", kind: "Series", year: "Ongoing" },
      { title: "Golf", kind: "Series", year: "Ongoing" },
    ],
  },
  {
    id: "theology",
    number: "03",
    name: "Theology",
    path: "/theology",
    discipline: "Lessons, video essays",
    year: "2024 to now",
    line: "LDS apologetics and Gospel Doctrine lessons and assets.",
    subpage: { label: "Open the Library", href: "/theology/library" },
    bg: "#E7E2D6",
    image: {
      src: "/cards/theology.jpg",
      alt: "Celestial chart illustration with sun, planets, and observers",
      width: 1080,
      height: 1800,
    },
    imagePos: "bottom",
    entries: [
      { title: "Sunday School lessons", kind: "PDF, slides, audio", year: "Ongoing", href: "/theology/library" },
      { title: "Armarium", kind: "Reading cabinet", year: "2026", href: "https://armarium-mu.vercel.app/" },
      { title: "Video essay", kind: "Video essay", year: "2026" },
    ],
  },
  {
    id: "professional",
    number: "04",
    name: "Professional",
    path: "/professional",
    discipline: "Career, consulting",
    year: "2008 to now",
    line: "CV, work projects, and skills.",
    bg: "#E2DED4",
    image: {
      src: "/cards/professional.jpg",
      alt: "Portrait of Scott Knudson",
      width: 944,
      height: 1125,
    },
    entries: [
      { title: "Current role", kind: "Role", year: "20XX to now" },
      { title: "Previous role", kind: "Role", year: "20XX to 20XX" },
      { title: "Earlier role", kind: "Role", year: "20XX to 20XX" },
    ],
  },
  {
    id: "other",
    number: "05",
    name: "Odds & Ends",
    path: "/other",
    discipline: "Recipes, favorites, rabbit holes",
    year: "Ongoing",
    line: "Screenplays, podcasts, and other fun things.",
    bg: "#D9DDD1",
    image: {
      src: "/cards/odds.jpg",
      alt: "Neon illustration of an astronaut in flight",
      width: 1600,
      height: 895,
    },
    entries: [
      { title: "Something delicious", kind: "Recipe", year: "2026" },
      { title: "Best album of the year", kind: "Favorite", year: "2025" },
      { title: "A rabbit hole", kind: "Link", year: "2025" },
      { title: "A random reflection", kind: "Thought", year: "2025" },
    ],
  },
];

// TODO: real profile URLs
export const socials = [
  { label: "LinkedIn", href: "https://linkedin.com/", icon: "linkedin" as const },
  { label: "X", href: "https://x.com/", icon: "x" as const },
  { label: "Instagram", href: "https://instagram.com/", icon: "instagram" as const },
];

export const contact = {
  lines: ["I create. Let's create *together.*"],
};

export interface Lesson {
  title: string;
  date: string;
  pdf?: string;
  slides?: string;
  audio?: string;
}

export const theologyLibrary = {
  label: "Theology",
  title: "Library",
  line: "Readings, lessons, and recordings.",
  armarium: {
    title: "Armarium",
    href: "https://armarium-mu.vercel.app/",
    line: "The reading cabinet.",
  },
  lessonsTitle: "Sunday School",
  lessonsLine: "Lessons as PDFs, slides, and recordings.",
  // TODO: real lessons. Drop files into /public/lessons/ and point these at them,
  // or use full URLs (Drive, YouTube, etc.). Omit a field and its link disappears.
  lessons: [
    {
      title: "Lesson one, title to be added",
      date: "2026",
      pdf: "/lessons/lesson-01.pdf",
      slides: "/lessons/lesson-01-slides.pdf",
      audio: "/lessons/lesson-01.mp3",
    },
    {
      title: "Lesson two, title to be added",
      date: "2026",
      pdf: "/lessons/lesson-02.pdf",
      audio: "/lessons/lesson-02.mp3",
    },
    {
      title: "Lesson three, title to be added",
      date: "2026",
      slides: "/lessons/lesson-03-slides.pdf",
    },
  ] as Lesson[],
};

export interface AppItem {
  name: string;
  kind: string;
  line: string;
  image: ImageSpec;
  /** omit and the app renders without a link */
  href?: string;
}

export const creativeApps = {
  label: "Vibe Projects",
  title: "The Apps",
  line: "Small software, built to be played with.",
  // TODO: real URLs for Lucky Links and IronCoach.
  // TODO: tighten the one-liners for Lucky Links, Swang, Nine Postures, and IronCoach.
  apps: [
    {
      name: "Lucky Links",
      kind: "Game",
      line: "Pixel golf with a lucky streak.",
      image: { src: "/apps/lucky-links.png", alt: "Lucky Links: a pixel-art golfer with his bag and cart", width: 1024, height: 1024 },
    },
    {
      name: "Swang",
      kind: "Game",
      line: "Golf in four shades of green.",
      image: { src: "/apps/swang.png", alt: "Swang: a Game Boy style golfer mid-swing", width: 1128, height: 928 },
      href: "https://swang-golf.vercel.app/",
    },
    {
      name: "Ruinous",
      kind: "Daily puzzle",
      line: "One expedition a day, one attempt.",
      image: { src: "/cards/creative2.png", alt: "Ruinous title art with pyramid and gems", width: 644, height: 405 },
      href: "https://ruinous.vercel.app/",
    },
    {
      name: "Nine Postures",
      kind: "App",
      line: "Nine ways of standing in the world.",
      image: { src: "/apps/nine-postures.png", alt: "Nine Postures logo with nine pixel-art figures", width: 796, height: 568 },
      href: "https://nine-postures.vercel.app/",
    },
    {
      name: "Quadrants",
      kind: "App",
      line: "Map perspectives. Find connections.",
      image: { src: "/apps/quadrants.png", alt: "Quadrants: create quads and discover alignment through visual data", width: 1013, height: 789 },
      href: "https://quadrants-i2ks.vercel.app/",
    },
    {
      name: "SlideKeep",
      kind: "App",
      line: "Turn slides into interest.",
      image: { src: "/apps/slidekeep.png", alt: "SlideKeep: upload your deck, gate the good stuff, capture every lead", width: 927, height: 1071 },
      href: "https://slidekeep.io",
    },
    {
      name: "IronCoach",
      kind: "App",
      line: "Strength coaching in your pocket.",
      image: { src: "/apps/ironcoach.png", alt: "IronCoach wordmark with a barbell", width: 1400, height: 600 },
      href: "#", // TODO: replace placeholder with the real IronCoach URL
    },
  ] as AppItem[],
};

export function nextDomain(id: Domain["id"]): Domain {
  const i = domains.findIndex((d) => d.id === id);
  return domains[(i + 1) % domains.length];
}
