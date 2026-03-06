export interface Hub {
  id: string;
  name: string;
  subtitle: string;
  path: string;
  color: string;
  frequency: number;
  amplitude: number;
}

export const HUBS: Hub[] = [
  {
    id: "photography",
    name: "Photography",
    subtitle: "Visual stories",
    path: "/photography",
    color: "#F59E0B",
    frequency: 1.2,
    amplitude: 30,
  },
  {
    id: "writing",
    name: "Creative Writing",
    subtitle: "Words & worlds",
    path: "/writing",
    color: "#A78BFA",
    frequency: 0.8,
    amplitude: 25,
  },
  {
    id: "theology",
    name: "Theology",
    subtitle: "Faith explored",
    path: "/theology",
    color: "#FDE68A",
    frequency: 0.6,
    amplitude: 20,
  },
  {
    id: "coded-creations",
    name: "Coded Creations",
    subtitle: "Built with code",
    path: "/coded-creations",
    color: "#22D3EE",
    frequency: 1.5,
    amplitude: 35,
  },
  {
    id: "work",
    name: "Work",
    subtitle: "The professional side",
    path: "/work",
    color: "#34D399",
    frequency: 1.0,
    amplitude: 28,
  },
  {
    id: "potpourri",
    name: "Potpourri",
    subtitle: "A bit of everything",
    path: "/potpourri",
    color: "#FB7185",
    frequency: 1.8,
    amplitude: 22,
  },
];
