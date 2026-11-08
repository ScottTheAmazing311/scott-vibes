// Loads the Procedural Pixel Creatures generator (C#, compiled to WebAssembly) on demand.
// It runs on the main thread: in a Web Worker the .NET 8 runtime booted but never returned a creature.

import type { Recipe } from "./cauldronData";

export interface Sprite {
  name: string;
  family: string;
  archetype: string;
  frameWidth: number;
  frameHeight: number;
  clips: { name: string; loop: boolean; frames: [number, number, number][] }[];
  /** the sprite sheet, decoded */
  sheet: HTMLImageElement;
}

interface Exports {
  Program: { Mix: (recipe: string) => string };
}

const FRAMEWORK = "/kidzone/cauldron/_framework/dotnet.js";
let engine: Promise<Exports> | null = null;

export function loadEngine(): Promise<Exports> {
  engine ??= (async () => {
    const { dotnet } = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ FRAMEWORK);
    const runtime = await dotnet.create();
    return (await runtime.getAssemblyExports("CreatureLab")) as Exports;
  })().catch((err) => {
    engine = null;
    throw err;
  });
  return engine;
}

/** Generates a creature and decodes its sprite sheet. */
export async function makeCreature(recipe: Recipe): Promise<Sprite> {
  const ex = await loadEngine();
  const out = JSON.parse(ex.Program.Mix(JSON.stringify(recipe)));
  const sheet = new Image();
  sheet.src = `data:image/png;base64,${out.png}`;
  await sheet.decode();
  return { name: out.name, family: out.family, archetype: out.archetype, frameWidth: out.frameWidth, frameHeight: out.frameHeight, clips: out.clips, sheet };
}

/** The first idle frame as a small PNG, for the Creature Book. */
export function thumbnail(s: Sprite): string {
  const c = document.createElement("canvas");
  c.width = s.frameWidth;
  c.height = s.frameHeight;
  const [x, y] = s.clips[0].frames[0];
  c.getContext("2d")!.drawImage(s.sheet, x, y, s.frameWidth, s.frameHeight, 0, 0, s.frameWidth, s.frameHeight);
  return c.toDataURL("image/png");
}
