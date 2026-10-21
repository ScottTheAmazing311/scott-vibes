// Cartoon animal calls synthesized with WebAudio. No audio files: each call
// is a little recipe of oscillators and filtered noise, tuned to be fun
// rather than realistic. All calls stay short and gentle on small ears.

import type { AnimalCall } from "@/lib/kidzone";

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  type AC = typeof AudioContext;
  const Ctor: AC | undefined = window.AudioContext ?? (window as unknown as { webkitAudioContext?: AC }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function noiseBuffer(c: AudioContext, seconds: number): AudioBuffer {
  const buf = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

interface ToneSpec {
  type: OscillatorType;
  from: number;
  to?: number;
  at: number;
  dur: number;
  gain: number;
  vibratoHz?: number;
  vibratoDepth?: number;
}

function tone(c: AudioContext, t0: number, spec: ToneSpec) {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = spec.type;
  const start = t0 + spec.at;
  osc.frequency.setValueAtTime(spec.from, start);
  if (spec.to) osc.frequency.exponentialRampToValueAtTime(spec.to, start + spec.dur);
  if (spec.vibratoHz) {
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    lfo.frequency.value = spec.vibratoHz;
    lfoGain.gain.value = spec.vibratoDepth ?? 12;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start(start);
    lfo.stop(start + spec.dur);
  }
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(spec.gain, start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, start + spec.dur);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(start);
  osc.stop(start + spec.dur + 0.05);
}

interface NoiseSpec {
  at: number;
  dur: number;
  gain: number;
  filter: BiquadFilterType;
  from: number;
  to?: number;
  q?: number;
}

function noise(c: AudioContext, t0: number, spec: NoiseSpec) {
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, spec.dur + 0.1);
  const f = c.createBiquadFilter();
  f.type = spec.filter;
  const start = t0 + spec.at;
  f.frequency.setValueAtTime(spec.from, start);
  if (spec.to) f.frequency.exponentialRampToValueAtTime(spec.to, start + spec.dur);
  if (spec.q) f.Q.value = spec.q;
  const g = c.createGain();
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(spec.gain, start + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, start + spec.dur);
  src.connect(f);
  f.connect(g);
  g.connect(c.destination);
  src.start(start);
  src.stop(start + spec.dur + 0.1);
}

export function playCall(call: AnimalCall) {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + 0.02;

  switch (call) {
    case "roar":
      noise(c, t, { at: 0, dur: 1.3, gain: 0.5, filter: "lowpass", from: 420, to: 130 });
      tone(c, t, { type: "sawtooth", from: 110, to: 58, at: 0, dur: 1.3, gain: 0.3, vibratoHz: 28, vibratoDepth: 14 });
      break;
    case "chuff":
      for (let i = 0; i < 4; i++) noise(c, t, { at: i * 0.18, dur: 0.12, gain: 0.4, filter: "bandpass", from: 420, q: 1.6 });
      break;
    case "whoop":
      for (let i = 0; i < 5; i++)
        tone(c, t, { type: "sine", from: 200 + i * 28, to: 480 + i * 40, at: i * 0.26, dur: 0.22, gain: 0.3 });
      break;
    case "screech":
      for (let i = 0; i < 4; i++)
        tone(c, t, { type: "sawtooth", from: 2600, to: 1700, at: i * 0.18, dur: 0.14, gain: 0.12 });
      break;
    case "neigh":
      tone(c, t, { type: "sawtooth", from: 880, to: 260, at: 0, dur: 1.1, gain: 0.2, vibratoHz: 13, vibratoDepth: 70 });
      noise(c, t, { at: 0.9, dur: 0.35, gain: 0.18, filter: "bandpass", from: 700, q: 2 });
      break;
    case "baa":
      tone(c, t, { type: "square", from: 330, at: 0, dur: 0.9, gain: 0.16, vibratoHz: 7, vibratoDepth: 26 });
      break;
    case "squeak":
      for (let i = 0; i < 3; i++)
        tone(c, t, { type: "sine", from: 1300, to: 2100, at: i * 0.2, dur: 0.14, gain: 0.25 });
      break;
    case "growl":
      tone(c, t, { type: "sawtooth", from: 62, to: 44, at: 0, dur: 1.5, gain: 0.3, vibratoHz: 19, vibratoDepth: 9 });
      noise(c, t, { at: 0, dur: 1.5, gain: 0.35, filter: "lowpass", from: 160 });
      break;
    case "honk":
      for (let i = 0; i < 2; i++) {
        tone(c, t, { type: "square", from: 270, to: 240, at: i * 0.4, dur: 0.3, gain: 0.14 });
        noise(c, t, { at: i * 0.4, dur: 0.3, gain: 0.2, filter: "bandpass", from: 900, q: 3 });
      }
      break;
    case "hiss-screech":
      noise(c, t, { at: 0, dur: 1.0, gain: 0.3, filter: "highpass", from: 1400, to: 2400 });
      break;
    case "buzz":
      tone(c, t, { type: "sawtooth", from: 172, at: 0, dur: 1.5, gain: 0.14, vibratoHz: 6, vibratoDepth: 10 });
      tone(c, t, { type: "sawtooth", from: 166, at: 0, dur: 1.5, gain: 0.12 });
      break;
    case "purr": {
      noise(c, t, { at: 0, dur: 1.8, gain: 0.4, filter: "lowpass", from: 95 });
      const lfoSrc = c.createOscillator();
      // amplitude flutter to make the purr "roll"
      const flutterGain = c.createGain();
      const carrier = c.createGain();
      lfoSrc.frequency.value = 24;
      flutterGain.gain.value = 0.15;
      lfoSrc.connect(flutterGain);
      flutterGain.connect(carrier.gain);
      lfoSrc.start(t);
      lfoSrc.stop(t + 1.8);
      break;
    }
  }
}
