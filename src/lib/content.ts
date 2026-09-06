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
  /** optional wide crop for the hub hero band (falls back to image) */
  header?: ImageSpec;
  /** CSS object-position for the home spread crop, e.g. "top" | "bottom" */
  imagePos?: string;
  entries: Entry[];
  /** optional prominent link to a deeper page */
  subpage?: { label: string; href: string };
}

export const site = {
  name: "Scott Knudson",
  /** header wordmark */
  wordmark: "Scott Knudson Creative",
  domain: "scottvibes.com",
  email: "scott.knudson@gmail.com",
  availability: "Taking on select projects from October 2026", // TODO: confirm
  resumeHref: "/resume.pdf", // TODO: add the file to /public
  description:
    "The collected work of Scott Knudson: theology, photography, creative projects, professional practice, and the things that fit nowhere else.",
};

export const hero = {
  cta: { label: "It's down here", href: "#work" },
};

// The apps, shown on /creative/apps and listed in the Vibe Projects hub index.
// TODO: real URLs for Lucky Links and IronCoach.
const appItems: AppItem[] = [
  {
    name: "Swang",
    kind: "Game",
    line: "Log golf practice and score rounds the Swang way.",
    image: { src: "/apps/swang.png", alt: "Swang: a Game Boy style golfer mid-swing", width: 1128, height: 928 },
    href: "https://swang-golf.vercel.app/",
  },
  {
    name: "Ruinous",
    kind: "Daily puzzle",
    line: "Trivia runner.",
    image: { src: "/cards/creative2.png", alt: "Ruinous title art with pyramid and gems", width: 644, height: 405 },
    href: "https://ruinous.vercel.app/",
  },
  {
    name: "Nine Postures",
    kind: "App",
    line: "A smarter personality test.",
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
    line: "Hyperpersonalized fitness trainer.",
    image: { src: "/apps/ironcoach.png", alt: "IronCoach wordmark with a barbell", width: 1400, height: 600 },
    // TODO: add href when IronCoach has a home; shows Coming soon until then
  },
  // Last until it has a link.
  {
    name: "Lucky Links",
    kind: "Game",
    line: "2D golf RPG game. Coming soon.",
    image: { src: "/apps/lucky-links.png", alt: "Lucky Links: a pixel-art golfer with his bag and cart", width: 1024, height: 1024 },
  },
];

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
      src: "/cards/creative3.png",
      alt: "Grid of six apps built by Scott: Lucky Links, Swang, Ruinous, Nine Postures, Quadrants, and SlideKeep",
      width: 1549,
      height: 1061,
    },
    card: {
      src: "/cards/creative.png",
      alt: "Grid of six apps built by Scott",
      width: 598,
      height: 790,
    },
    entries: appItems.map((a) => ({
      title: a.name,
      kind: a.kind,
      year: "2026",
      href: a.href && a.href !== "#" ? a.href : undefined,
    })),
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
    header: { src: "/headers/theology.jpg", alt: "Celestial engraving of a sun with a watching eye", width: 1080, height: 311 },
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
      { title: "Sunday School lessons", kind: "Slides and audio", year: "Ongoing", href: "/theology/lessons" },
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
    header: { src: "/headers/professional.jpg", alt: "Eyes of Scott Knudson against a green backdrop", width: 1682, height: 237 },
    bg: "#E2DED4",
    image: {
      src: "/cards/professional.jpg",
      alt: "Portrait of Scott Knudson",
      width: 944,
      height: 1125,
    },
    // TODO: point Projects at the built-things gallery when it exists.
    entries: [
      { title: "Work CV", kind: "LinkedIn", year: "2026", href: "https://www.linkedin.com/in/scotttheamazing/" },
      { title: "Projects", kind: "Things I've built", year: "2026" },
      { title: "Content", kind: "Speaking", year: "2026", href: "https://www.youtube.com/watch?v=94VevwovokM" },
    ],
  },
  {
    id: "other",
    number: "05",
    name: "Odds & Ends",
    path: "/other",
    discipline: "Recipes, favorites, rabbit holes",
    year: "Ongoing",
    line: "Screenplays, podcasts, music, and other fun things.",
    header: { src: "/headers/odds.jpg", alt: "Neon astronaut streaking through space", width: 2165, height: 471 },
    bg: "#D9DDD1",
    image: {
      src: "/cards/odds.jpg",
      alt: "Neon illustration of an astronaut in flight",
      width: 1600,
      height: 895,
    },
    // TODO: links for Sunnyside Mall and UltraCosmic when they have homes.
    entries: [
      { title: "Sunnyside Mall", kind: "Pilot screenplay", year: "2026" },
      { title: "UltraCosmic", kind: "Project", year: "2026" },
      { title: "Steal This Idea", kind: "Podcast", year: "2026", href: "https://gostealthisidea.com/" },
      { title: "Compass", kind: "Album", year: "2026", href: "https://soundcloud.com/scotttheamazing/sets/compass" },
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

export const theologyLibrary = {
  label: "Theology",
  title: "Library",
  line: "Readings, lessons, and resources.",
  armarium: {
    title: "Armarium",
    href: "https://armarium-mu.vercel.app/",
    line: "The reading cabinet.",
  },
  lessonsTitle: "Gospel Doctrine",
  lessonsLine: "Lessons and the materials behind them.",
  folders: [
    {
      title: "Sunday School lessons",
      line: "Every lesson with its slides and recording.",
      href: "/theology/lessons",
    },
    {
      title: "Lesson resources",
      line: "The raw Drive folder: slides, songs, and assets.",
      href: "https://drive.google.com/drive/folders/1uOR5qyBspwwINPAMCQL5qsqe4hu7nUay",
    },
  ],
};

export interface SundayLesson {
  slug: string;
  title: string;
  /** curriculum block; the listing groups by this */
  course: string;
  /** customize: one line about the lesson, shown on the card and the page */
  line?: string;
  /** Google Slides file id — embeds the interactive lesson */
  slidesId?: string;
  /** Google Drive audio file id — embeds the recording */
  audioId?: string;
  /** songs written for the lesson: artwork + a playable Drive embed each */
  songs?: { title: string; audioId: string; art?: ImageSpec }[];
  /** extra materials, e.g. a songs folder */
  links?: { label: string; href: string }[];
}

// Sunday School lessons (/theology/lessons). To add one: append an entry with a
// unique slug; slidesId is the Google Slides id, audioId the Drive file id —
// both must be shared "anyone with the link". Everything here is editable.
export const sundayLessons: SundayLesson[] = [
  { slug: "intro-to-ot", title: "Introduction to the Old Testament", course: "Old Testament", audioId: "1TiKgwwDJTglgkyetr5WA_ODCTCURzH4x" },
  { slug: "genesis-18-23", title: "Genesis 18–23", course: "Old Testament", audioId: "1bLWZfqFiZTrZwErnaueb3TXundbDGRsr" },
  { slug: "moses-6", title: "Moses 6", course: "Old Testament", audioId: "1-rl0xahdmFy3abM6K8b1nDnLx6Zx1kQ7" },
  { slug: "1-kings", title: "1 Kings", course: "Old Testament", slidesId: "14K3zHL8byk9NnIQh0A4xuGrkqGvUgcIrCLDOwMy6d18" },
  { slug: "ezra-nehemiah", title: "Ezra & Nehemiah", course: "Old Testament", slidesId: "114tyBtaVpqs0-G0uRSrvSSivcDURoQnLfpI2N5h0vd4" },
  {
    slug: "psalms",
    title: "Psalms",
    course: "Old Testament",
    slidesId: "1zPBdpeDZE3LrIa8Jg-BS40MGYpGx1JAyekD8A6UcOL4",
    songs: [
      {
        title: "A Lamp unto My Feet",
        audioId: "1minFcvTbm_4CZM2VNGixVL9FNZ2p6szZ",
        art: { src: "/lessons/psalms/lamp.jpg", alt: "A woman carrying a lantern down a dark forest path", width: 1200, height: 1200 },
      },
      {
        title: "Bless the Lord, O My Soul",
        audioId: "1zjt7b0C8seKAvxiRBZAEAfgcOSOP1J1v",
        art: { src: "/lessons/psalms/bless.jpg", alt: "Artwork for Bless the Lord, O My Soul", width: 1200, height: 1200 },
      },
      {
        title: "Hear My Prayer",
        audioId: "1YrrMZVicX2JAJs4SDd3WR1yh5QMQbwC_",
        art: { src: "/lessons/psalms/hear.jpg", alt: "Artwork for Hear My Prayer", width: 1200, height: 1200 },
      },
      {
        title: "Peace Upon Israel",
        audioId: "1Kx-0cep2pZ9vECyyOpBvU1jQ5NaVYTEb",
        art: { src: "/lessons/psalms/peace.jpg", alt: "Artwork for Peace Upon Israel", width: 1200, height: 1200 },
      },
    ],
  },
  { slug: "dc-3-5", title: "Doctrine & Covenants 3–5", course: "Doctrine & Covenants", audioId: "1xbPf612XWmN_3OA343znRPw5Syb1UpmX" },
  { slug: "dc-18", title: "Doctrine & Covenants 18", course: "Doctrine & Covenants", audioId: "1WA6qGteEqmnYPfUYNdgT2tdOIN3g2ivb" },
  { slug: "dc-41-44", title: "Doctrine & Covenants 41–44", course: "Doctrine & Covenants", audioId: "1AN7FjpnnOQgCPTMexPvxLztIBxije-ri" },
  { slug: "dc-51-57", title: "Doctrine & Covenants 51–57", course: "Doctrine & Covenants", audioId: "19Qe9uoMhAOQn4YjO_EQl9xmfwXBKSkpP" },
  { slug: "dc-71", title: "Doctrine & Covenants 71", course: "Doctrine & Covenants", audioId: "1WYUzL-82TL8IcPi2qlPkpeq4KPay0juJ" },
  { slug: "dc-84", title: "Doctrine & Covenants 84", course: "Doctrine & Covenants", audioId: "1WsGQJ3PA9_gfOx-zORpTwgG2rBDHD9ii" },
  { slug: "dc-94-97", title: "Doctrine & Covenants 94–97", course: "Doctrine & Covenants", audioId: "1pyf9e8O8bxLDys_jdoYmnzFHUubl87Vw" },
  { slug: "dc-137-138", title: "Doctrine & Covenants 137–138", course: "Doctrine & Covenants", audioId: "1OEceR3T7eyNf8q6Smpkis_JKvT6OAT3C" },
  { slug: "ether-1-5", title: "Ether 1–5", course: "Book of Mormon", audioId: "1v1Iy6h6gIaH1ynk5ErUEOXR7kbd2ygqh" },
  { slug: "moroni-1-8", title: "Moroni 1–8", course: "Book of Mormon", audioId: "1_t-q9b5-8aMoTfubw00vbxWRbAXE0AUm" },
];

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
  header: { src: "/headers/apps.png", alt: "Row of six app cards", width: 1682, height: 237 } as ImageSpec,
  apps: appItems,
};

