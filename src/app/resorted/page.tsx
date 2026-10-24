import Bars from "@/components/resorted/Bars";
import CanonGrid from "@/components/resorted/CanonGrid";
import Chip from "@/components/resorted/Chip";
import Compass from "@/components/resorted/Compass";
import GlanceTable from "@/components/resorted/GlanceTable";
import Glyph from "@/components/resorted/Glyph";
import HouseChapter from "@/components/resorted/HouseChapter";
import { hv } from "@/components/resorted/hv";
import MonopolyTable from "@/components/resorted/MonopolyTable";
import { PairGlyph, VsDots } from "@/components/resorted/PairGlyph";
import QuadSwitch from "@/components/resorted/QuadSwitch";
import Quiz from "@/components/resorted/Quiz";
import RelationshipSquare from "@/components/resorted/RelationshipSquare";
import Reveal from "@/components/resorted/Reveal";
import Rooms from "@/components/resorted/Rooms";
import TopBar from "@/components/resorted/TopBar";
import { capacities, collisions, pairs, scenarios } from "@/lib/resorted/content";
import { houses } from "@/lib/resorted/houses";
import { mapOrder, readingOrder, type Key } from "@/lib/resorted/model";

const navLinks = [
  { href: "#idea", label: "Idea" },
  { href: "#map", label: "Map" },
  { href: "#tiebreaker", label: "Tiebreaker" },
  { href: "#houses", label: "Houses" },
  { href: "#monopoly", label: "Monopoly" },
  { href: "#pairs", label: "Pairs" },
  { href: "#canon", label: "Canon" },
  { href: "#faq", label: "FAQ" },
];

const originalDeal: { k: Key; traits: string; reads: string; rigged?: boolean }[] = [
  { k: "g", traits: "brave, daring, chivalrous", reads: "compliments" },
  { k: "r", traits: "witty, learned, wise", reads: "compliments" },
  { k: "h", traits: "loyal, patient, hard-working", reads: "mild compliments" },
  { k: "s", traits: "cunning, ambitious", reads: "a rap sheet", rigged: true },
];

const principles = [
  { title: "One driver per house", text: "A driver explains why someone acts." },
  { title: "Every driver cuts both ways", text: "Each one has to produce a hero and a villain." },
  { title: "No free passes", text: "Every house is as risky as it is appealing." },
  { title: "Sort by tiebreaker", text: "Everyone uses all four. Your house wins when they collide." },
];

const spectra: { a: { title: string; text: string; chips: Key[] }; b: { title: string; text: string; chips: Key[] } }[] = [
  {
    a: { title: "Heart", text: "Goes with the gut, or with the people in the room.", chips: ["g", "h"] },
    b: { title: "Head", text: "Needs it to make sense first.", chips: ["r", "s"] },
  },
  {
    a: { title: "Self", text: "Answers to their own conviction or goals.", chips: ["g", "s"] },
    b: { title: "Beyond self", text: "Answers to a code or a community.", chips: ["r", "h"] },
  },
];

const squarePoints = [
  {
    focus: "rivals" as const,
    title: "Gryffindor and Slytherin are the rivalry",
    text: "Both answer to themselves, so they fight over who leads. One goes by gut, the other by plan.",
  },
  {
    focus: "background" as const,
    title: "Ravenclaw and Hufflepuff stay in the background",
    text: "Both answer to something outside themselves, so they rarely chase the spotlight.",
  },
  {
    focus: "diagonals" as const,
    title: "The diagonals clash",
    text: "Gryffindor and Ravenclaw, and Hufflepuff and Slytherin, are opposite on both axes. They’re the hardest pairs and have the most to teach each other.",
  },
];

const traditions: { k: Key; name: string; text: string; fails: string }[] = [
  { k: "g", name: "Conviction", text: "Act on what you believe.", fails: "certainty with no check on it." },
  { k: "s", name: "Outcomes", text: "The right choice gets the best result.", fails: "the ends justifying the means." },
  { k: "h", name: "Care", text: "Morality lives in what you owe particular people.", fails: "my people over everyone else." },
  { k: "r", name: "Duty", text: "Some acts are wrong whatever the result.", fails: "Kant refusing to lie to a murderer at the door." },
];

const faq = [
  {
    q: "Which house is the best?",
    a: "None. Every house should produce someone you’d want in your corner and someone you’d never trust.",
  },
  {
    q: "Isn’t this just choosing which flaws you like?",
    a: "Partly. Picking a house means picking the failures you’ll watch for in yourself.",
  },
  {
    q: "Can your house change?",
    a: "Your dominant driver mostly stays put, especially under stress. Your secondary can grow. Neville was timid at eleven and leading a resistance at seventeen.",
  },
  {
    q: "What if my top two are nearly tied?",
    a: "Then the lead trades with the situation. The quiz gives you a blend for that.",
  },
  {
    q: "Where did intelligence go?",
    a: "Every house has it. Ravenclaws go deep, Slytherins think ahead, Hufflepuffs read people and Gryffindors read the moment.",
  },
  {
    q: "Why do so many Gryffindors move?",
    a: "The books put the good guys in Gryffindor. Sorted by driver, the rule-keepers go to Ravenclaw, the loyal ones to Hufflepuff and the planners to Slytherin.",
  },
  {
    q: "Isn’t Ravenclaw just “follows the rules”?",
    a: "Only their own rules. Luna’s code is homemade. What counts is keeping it when it costs something.",
  },
  {
    q: "Where does the Sorting Hat fit?",
    a: "The Hat sorts by traits. This sorts by the driver behind them. The Hat also listens to what you ask for, which says a lot about your driver.",
  },
];

function Head({ children, lede }: { children: React.ReactNode; lede?: string }) {
  return (
    <Reveal className="rs-section-head">
      <h2 className="rs-h2">{children}</h2>
      {lede && <p className="rs-lede">{lede}</p>}
    </Reveal>
  );
}

export default function ResortedPage() {
  return (
    <>
      <Rooms />
      <TopBar links={navLinks} />

      <main id="top">
        {/* Hero */}
        <section className="rs-hero" data-room="none">
          <div className="rs-wrap rs-hero-grid">
            <Reveal>
              <h1 className="rs-h1">
                Every house runs on <em>one</em> driver.
              </h1>
              <p className="rs-lede">Anyone can be brave or clever. Your house is what you check first when a decision gets hard.</p>
              <div className="rs-ctas">
                <a href="#quiz" className="rs-btn rs-btn-primary">
                  Take the quiz
                </a>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <Compass />
            </Reveal>
          </div>
        </section>

        {/* The problem */}
        <section id="idea" className="rs-section" data-room="none">
          <div className="rs-wrap">
            <Head>Why the original four don’t work</Head>
            <div className="rs-split">
              <Reveal className="rs-prose">
                <p>
                  Gryffindor gets brave, daring and chivalrous. Slytherin gets cunning and ambitious. One list is compliments and the other
                  is a rap sheet, so everyone wants the same house.
                </p>
                <p>
                  The traits don’t sort people, either. Cedric was brave and a Hufflepuff. Hermione, Snape and Dumbledore were brilliant
                  and none of them were Ravenclaws.
                </p>
                <p>So each house gets one driver instead, and every driver produces heroes and villains.</p>
              </Reveal>
              <Reveal delay={120}>
                <span className="rs-label" style={{ display: "block", marginBottom: 16 }}>
                  The original deal
                </span>
                <div className="rs-deal" role="table" aria-label="The original deal">
                  <div className="sr-only" role="row">
                    <span role="columnheader">House</span>
                    <span role="columnheader">Classic traits</span>
                    <span role="columnheader">Reads as</span>
                  </div>
                  {originalDeal.map((row) => (
                    <div key={row.k} className="rs-deal-row" role="row" style={hv(row.k)} data-rigged={row.rigged ? "" : undefined}>
                      <span className="rs-deal-name" role="cell">
                        {houses[row.k].name}
                      </span>
                      <span className="rs-deal-traits" role="cell">
                        {row.traits}
                      </span>
                      <span className="rs-deal-reads" role="cell">
                        {row.reads}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="rs-principles">
              {principles.map((p, i) => (
                <Reveal key={p.title} className="rs-principle" delay={i * 90}>
                  <Glyph active={mapOrder.slice(0, i + 1)} size={16} />
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </Reveal>
              ))}
            </div>

            <div className="rs-sub">
              <Reveal className="rs-sub-head">
                <h3 className="rs-h3">Same virtue, four drivers</h3>
              </Reveal>
              <Reveal>
                <QuadSwitch
                  label="Virtues"
                  prompt="Virtue"
                  items={capacities.map((c) => ({ title: c.title, values: { g: c.g, r: c.r, h: c.h, s: c.s } }))}
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* The structure */}
        <section id="map" className="rs-section" data-room="none">
          <div className="rs-wrap">
            <Head lede="Head or heart? Yourself or something bigger? Each house takes one corner.">Two questions under the four houses</Head>

            <div className="rs-spectra">
              {spectra.map((row, i) => (
                <Reveal key={row.a.title} className="rs-spectrum" delay={i * 100}>
                  {[row.a, row.b].map((end) => (
                    <div key={end.title} className="rs-spec-end">
                      <h3>{end.title}</h3>
                      <p>{end.text}</p>
                      <div className="rs-chiprow">
                        {end.chips.map((k) => (
                          <Chip key={k} k={k}>
                            {houses[k].name}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  ))}
                </Reveal>
              ))}
            </div>

            <div className="rs-sub">
              <RelationshipSquare points={squarePoints} />
            </div>

            <div className="rs-sub">
              <Reveal className="rs-sub-head">
                <h3 className="rs-h3">Four ethical traditions</h3>
                <p className="rs-sublede">Each driver matches a real school of moral thought, and each school has a known way of failing.</p>
              </Reveal>
              <div className="rs-trads">
                {traditions.map((t, i) => (
                  <Reveal key={t.k} className="rs-trad" delay={i * 90} style={hv(t.k)}>
                    <span className="rs-hl">
                      <Glyph active={[t.k]} size={11} />
                      {houses[t.k].name}
                    </span>
                    <h3>{t.name}</h3>
                    <p>{t.text}</p>
                    <p className="rs-trad-fail">
                      <span className="rs-label">Fails as</span>
                      {t.fails}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How sorting works */}
        <section id="tiebreaker" className="rs-section" data-room="none">
          <div className="rs-wrap">
            <Head>Everyone runs all four</Head>
            <div className="rs-split">
              <Reveal>
                <p className="rs-lede" style={{ marginTop: 0 }}>
                  Most choices don’t force a ranking. The bold move and the kind move are often the same move. Your house shows up when
                  they split.
                </p>
                <p className="rs-pull">Dumbledore told Snape he wondered if they sort too soon. Sort people when two drivers disagree.</p>
              </Reveal>
              <Reveal className="rs-profile" delay={120}>
                <span className="rs-label">Example</span>
                <Bars
                  data={[
                    { k: "g", value: 38 },
                    { k: "h", value: 29 },
                    { k: "s", value: 19 },
                    { k: "r", value: 14 },
                  ]}
                />
                <p className="rs-profile-note">A Gryffindor with a Hufflepuff streak. Strategy and principle are still there. They just lose the tiebreaks.</p>
              </Reveal>
            </div>

            <div className="rs-sub">
              <Reveal className="rs-sub-head">
                <h3 className="rs-h3">Six collisions</h3>
              </Reveal>
              <div className="rs-collisions">
                {collisions.map((c, i) => (
                  <Reveal key={`${c.a}${c.b}`} className="rs-collision" delay={i * 60}>
                    <span className="rs-collision-vs">
                      <VsDots a={c.a} b={c.b} />
                      <span>
                        <span style={{ color: `var(--${c.a})` }}>{houses[c.a].driver}</span> <span className="vs">vs.</span>{" "}
                        <span style={{ color: `var(--${c.b})` }}>{houses[c.b].driver}</span>
                      </span>
                    </span>
                    <p>{c.text}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* The four houses */}
        <section id="houses" className="rs-section" style={{ paddingBottom: 0 }}>
          <div className="rs-wrap" data-room="none">
            <Head>The four houses</Head>
            <Reveal className="rs-doors">
              {readingOrder.map((k) => (
                <a key={k} href={`#${houses[k].id}`} className="rs-door" style={hv(k)}>
                  <span className="rs-door-glyph">
                    <Glyph active={[k]} size={18} />
                  </span>
                  <span className="rs-door-name">{houses[k].name}</span>
                  <span className="rs-door-meta">
                    <span>{houses[k].driver}</span>
                  </span>
                </a>
              ))}
            </Reveal>
            <Reveal>
              <GlanceTable />
            </Reveal>
          </div>
          {readingOrder.map((k) => (
            <HouseChapter key={k} k={k} />
          ))}
        </section>

        {/* Monopoly */}
        <section id="monopoly" className="rs-section" data-room="none">
          <div className="rs-wrap">
            <Head lede="One of each house at a Monopoly table. Pick a round.">The Monopoly test</Head>
            <Reveal>
              <MonopolyTable />
            </Reveal>
          </div>
        </section>

        {/* Drivers in the wild */}
        <section id="wild" className="rs-section" data-room="none">
          <div className="rs-wrap">
            <Head lede="Each house’s first instinct. None of them is the right answer.">Higher stakes</Head>
            <Reveal>
              <QuadSwitch
                variant="sentence"
                label="Situations"
                prompt="Situation"
                items={scenarios.map((s) => ({ title: s.title, values: { g: s.g, r: s.r, h: s.h, s: s.s } }))}
              />
            </Reveal>
          </div>
        </section>

        {/* Pairs */}
        <section id="pairs" className="rs-section" data-room="none">
          <div className="rs-wrap">
            <Head lede="Neighbors share an axis and get along. Diagonals share nothing and have the most to learn from each other.">
              How the houses get along
            </Head>
            <div className="rs-pairs">
              {pairs.map((p, i) => (
                <Reveal key={`${p.a}${p.b}`} className="rs-pair" delay={(i % 3) * 90} data-diagonal={p.diagonal ? "" : undefined}>
                  <PairGlyph a={p.a} b={p.b} diagonal={p.diagonal} />
                  <h3>
                    <span style={{ color: `var(--${p.a})` }}>{houses[p.a].name}</span>
                    <span className="plus">+</span>
                    <span style={{ color: `var(--${p.b})` }}>{houses[p.b].name}</span>
                  </h3>
                  <span className="rs-label">
                    {p.kind} · {p.share}
                  </span>
                  <p>{p.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Canon */}
        <section id="canon" className="rs-section" data-room="none">
          <div className="rs-wrap">
            <Head lede="The books’ characters, sorted by driver. Argue with it.">
              Hogwarts, <em>re-sorted</em>
            </Head>
            <CanonGrid />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="rs-section" data-room="none">
          <div className="rs-wrap">
            <Head>Questions</Head>
            <div className="rs-faq">
              {faq.map((item, i) => (
                <Reveal key={item.q} className="rs-faq-item" delay={(i % 2) * 80}>
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Quiz */}
        <section id="quiz" className="rs-section" data-room="none">
          <div className="rs-wrap">
            <Quiz
              intro={
                <>
                  <h2 className="rs-h2">
                    The sorting <em>quiz</em>
                  </h2>
                  <p className="rs-lede">
                    28 questions. Pick the answer most like you, and a second if it also fits. First picks count 3 points, second picks 1.
                  </p>
                </>
              }
            />
          </div>
        </section>
      </main>

      <footer className="rs-footer" data-room="none">
        <div className="rs-wrap rs-footer-in">
          <div>
            <span className="rs-footer-mark">
              <Glyph active="all" size={34} />
              Re-Sorted
            </span>
            <p>An unofficial fan project. Not affiliated with the Harry Potter books, the films, or their publishers.</p>
          </div>
          <a href="#top">Back to top</a>
        </div>
      </footer>
    </>
  );
}
