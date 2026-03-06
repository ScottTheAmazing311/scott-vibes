export interface Hub {
  id: string;
  name: string;
  subtitle: string;
  path: string;
  color: string;
  frequency: number;
  amplitude: number;
}

// Sanzo Wada-inspired palette: Brick Red, Slate, Ivory Buff
const BRICK = "#A32100";
const SLATE = "#1B3644";
const IVORY = "#EBD999";

export const HUBS: Hub[] = [
  {
    id: "photography",
    name: "Photography",
    subtitle: "Visual stories",
    path: "/photography",
    color: BRICK,
    frequency: 1.2,
    amplitude: 30,
  },
  {
    id: "writing",
    name: "Creative Writing",
    subtitle: "Words & worlds",
    path: "/writing",
    color: SLATE,
    frequency: 0.8,
    amplitude: 25,
  },
  {
    id: "theology",
    name: "Theology",
    subtitle: "Faith explored",
    path: "/theology",
    color: IVORY,
    frequency: 0.6,
    amplitude: 20,
  },
  {
    id: "coded-creations",
    name: "Coded Creations",
    subtitle: "Built with code",
    path: "/coded-creations",
    color: SLATE,
    frequency: 1.5,
    amplitude: 35,
  },
  {
    id: "work",
    name: "Work",
    subtitle: "The professional side",
    path: "/work",
    color: BRICK,
    frequency: 1.0,
    amplitude: 28,
  },
  {
    id: "potpourri",
    name: "Potpourri",
    subtitle: "A bit of everything",
    path: "/potpourri",
    color: IVORY,
    frequency: 1.8,
    amplitude: 22,
  },
];
