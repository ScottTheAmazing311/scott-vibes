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
import { canon, capacities, collisions, pairs, scenarios } from "@/lib/resorted/content";
import { houses } from "@/lib/resorted/houses";
import { mapOrder, readingOrder, type Key } from "@/lib/resorted/model";
import { blends } from "@/lib/resorted/quiz-data";

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
  { k: "g", traits: "brave, daring, chivalrous", reads: "all compliments" },
  { k: "r", traits: "wit, learning, wisdom", reads: "all compliments" },
  { k: "h", traits: "loyal, patient, hard-working", reads: "quiet compliments" },
  { k: "s", traits: "cunning, ambitious, any means necessary", reads: "a villain’s résumé", rigged: true },
];

const principles = [
  { title: "One driver per house", text: "A motivating force, not a trait. It explains why someone acts, not just how it looks." },
  { title: "Every driver cuts both ways", text: "The same driver has to produce a hero and a villain, or it’s padding." },
  { title: "No free passes", text: "Each house is equally compelling to join and equally problematic to be." },
  { title: "Sort by tiebreaker", text: "Everyone uses all four. Your house is the one that wins when they collide." },
];

const spectra: { a: { title: string; text: string; chips: Key[] }; b: { title: string; text: string; chips: Key[] } }[] = [
  {
    a: { title: "Heart", text: "Decides by instinct and feeling. Trusts the gut or the people in the room.", chips: ["g", "h"] },
    b: { title: "Head", text: "Decides by analysis. Wants it to make sense before acting on it.", chips: ["r", "s"] },
  },
  {
    a: { title: "Self", text: "Answers to their own conviction or their own goals.", chips: ["g", "s"] },
    b: { title: "Beyond self", text: "Answers to something bigger: a code or a community.", chips: ["r", "h"] },
  },
];

const squarePoints = [
  {
    focus: "rivals" as const,
    title: "Why Gryffindor and Slytherin are the rivalry",
    text: "They’re the two houses that answer to themselves, so they compete for the same thing: who leads. The only difference is method, gut versus plan.",
  },
  {
    focus: "background" as const,
    title: "Why Ravenclaw and Hufflepuff sit in the background",
    text: "Both defer to something outside themselves, a code or a community. They rarely grab the spotlight, because the spotlight isn’t what they answer to.",
  },
  {
    focus: "diagonals" as const,
    title: "Why the diagonals clash",
    text: "Gryffindor and Ravenclaw, and Hufflepuff and Slytherin, are opposite on both axes. They share nothing, which makes them the hardest pairs and the best teachers for each other.",
  },
];

const traditions: { k: Key; name: string; text: string; fails: string }[] = [
  { k: "g", name: "Conviction", text: "Act on what you believe. Character is proven in action, not in theory.", fails: "certainty with nothing to check it." },
  { k: "s", name: "Outcomes", text: "The right choice is the one that produces the best result.", fails: "the ends justifying the means." },
  { k: "h", name: "Care", text: "Morality lives in your responsibilities to particular people.", fails: "my people over everyone else." },
  {
    k: "r",
    name: "Duty",
    text: "Some acts are right or wrong no matter how they turn out.",
    fails: "Kant’s famous claim that you shouldn’t lie even to a murderer at your door.",
  },
];

const faq = [
  {
    q: "Which house is the best?",
    a: "None of them, by design. Here’s the test: for every house, you should be able to name someone you’d want in your corner and someone you’d never trust, and both should be sorted correctly. If a house only produces heroes, its traits are padded. If it only produces villains, it’s been rigged.",
  },
  {
    q: "Isn’t this just choosing which flaws you like?",
    a: "Partly, and that’s the point. Choosing a house means choosing which virtues you want and which failures you’re willing to watch for in yourself. The original system let some houses keep only the virtues.",
  },
  {
    q: "Can your house change?",
    a: "Your dominant driver tends to stay put, especially under stress, which is when people fall back on it. Your secondary can grow a lot. Neville Longbottom’s boldness barely existed at eleven, and at seventeen he was leading a resistance.",
  },
  {
    q: "What if my top two are nearly tied?",
    a: "That’s common, and it’s useful. A near tie means two drivers trade the lead depending on the situation. The quiz gives you a blend, which often describes a person better than a single house does.",
  },
  {
    q: "Where did intelligence go?",
    a: "Everywhere. It’s a capacity, like courage, and every driver uses it differently. A Ravenclaw goes deep, a Slytherin plays it forward, a Hufflepuff reads people, and a Gryffindor reads the moment.",
  },
  {
    q: "Why do so many Gryffindors move?",
    a: "Because the books used Gryffindor as the home for the good guys. Sorting by driver instead of virtue spreads those people out: the rule-keepers go to Ravenclaw, the loyal ones go to Hufflepuff, and the long-game planners go to Slytherin.",
  },
  {
    q: "Isn’t Ravenclaw just “follows the rules”?",
    a: "Only if the rules are their code. A Ravenclaw follows whatever system they believe in, and that system can be homemade, unpopular, or in open defiance of the school. What matters is that they’ll follow it when it costs them.",
  },
  {
    q: "Where does the Sorting Hat fit?",
    a: "The books sort by traits, and traits are outputs. This framework sorts by driver, the input. The Hat also famously listens to what you ask for, and what someone asks for is a pretty good clue to their driver.",
  },
];

function Head({ kicker, children, lede }: { kicker: string; children: React.ReactNode; lede?: string }) {
  return (
    <Reveal className="rs-section-head">
      <span className="rs-kicker">
        <Glyph active="all" size={10} />
        {kicker}
      </span>
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
              <span className="rs-kicker">An unofficial re-sorting of the four houses</span>
              <h1 className="rs-h1">
                Every house runs on <em>one</em> driver.
              </h1>
              <p className="rs-lede">
                Courage, intelligence, loyalty and ambition are things anyone can have. This framework sorts people by what they consult
                first when a decision gets hard. Every driver produces heroes and villains, so every house is equally worth wanting and
                equally capable of going wrong.
              </p>
              <div className="rs-ctas">
                <a href="#quiz" className="rs-btn rs-btn-primary">
                  Take the 28-question quiz
                </a>
                <a href="#idea" className="rs-btn rs-btn-ghost">
                  Read the framework
                </a>
              </div>
              <p className="rs-stats">
                <span>
                  <b>4</b> drivers
                </span>
                <span>
                  <b>2</b> axes
                </span>
                <span>
                  <b>{canon.length}</b> characters re-sorted
                </span>
                <span>
                  <b>{Object.keys(blends).length}</b> blends
                </span>
              </p>
            </Reveal>
            <Reveal delay={160}>
              <Compass />
              <p className="rs-compass-caption">Every hard decision sends you to one of four questions first. That question is your house.</p>
            </Reveal>
          </div>
        </section>

        {/* The problem */}
        <section id="idea" className="rs-section" data-room="none">
          <div className="rs-wrap">
            <Head kicker="The problem">Why the original four don’t work</Head>
            <div className="rs-split">
              <Reveal className="rs-prose">
                <p>
                  The classic house traits aren’t a fair fight. Gryffindor gets bravery, daring and chivalry, which are all compliments.
                  Slytherin gets cunning and ambition, which is the vocabulary you’d use to describe the devil. With the deck stacked
                  like that, everyone wants the same house and nobody wants the other one.
                </p>
                <p>
                  The traits also fall apart as sorting rules. Courage can’t define a house, because anyone can be brave. Cedric Diggory
                  was brave, and he was a Hufflepuff. Seamus Finnigan was sorted for bravery and is mostly remembered for blowing things
                  up. Intelligence can’t define a house either: Hermione, Snape and Dumbledore were all brilliant, and none of them were
                  Ravenclaws.
                </p>
                <p>
                  Courage, intelligence, loyalty and ambition are capacities, and any driver can produce them. What separates people is
                  the driver underneath: the thing they consult first when a decision gets hard. So the fix is to give each house one
                  driver, and to choose drivers that produce real virtues and real vices from the same source.
                </p>
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
                <p className="rs-deal-note">
                  Three houses get padded lists of virtues and one gets a warning label. The re-sort gives every house one neutral driver
                  that cuts both ways.
                </p>
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
                <p className="rs-sublede">Every classic house trait shows up in every house. The driver changes what it looks like.</p>
              </Reveal>
              <Reveal>
                <QuadSwitch
                  label="Virtues"
                  prompt="Pick a virtue"
                  items={capacities.map((c) => ({ title: c.title, values: { g: c.g, r: c.r, h: c.h, s: c.s } }))}
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* The structure */}
        <section id="map" className="rs-section" data-room="none">
          <div className="rs-wrap">
            <Head
              kicker="The structure"
              lede="Do you decide with your head or your heart? And do you answer to yourself, or to something beyond yourself? Plot the four drivers on those two axes and they land one per corner. The houses stop being a list and become a map."
            >
              Two questions sit underneath the four houses
            </Head>

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
                <h3 className="rs-h3">Four serious ethical traditions</h3>
                <p className="rs-sublede">
                  Each driver lines up with a real school of moral thought. That’s the strongest case that no house is the default good
                  one: each tradition is respectable, and each has a famous way of going wrong.
                </p>
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
            <Head kicker="How sorting works">Everyone runs all four drivers</Head>
            <div className="rs-split">
              <Reveal>
                <p className="rs-lede" style={{ marginTop: 0 }}>
                  Nobody is purely bold or purely strategic. Most everyday choices don’t force a ranking, because the bold move, the
                  right move, the kind move and the smart move are often the same move. A house only shows up when drivers collide. Your
                  house is the driver that wins the tie.
                </p>
                <p className="rs-pull">
                  Dumbledore once wondered aloud to Snape whether they sort too soon. This framework agrees. Watch someone when two
                  drivers point in different directions and you’ll see their house.
                </p>
              </Reveal>
              <Reveal className="rs-profile" delay={120}>
                <span className="rs-label">An example profile</span>
                <Bars
                  data={[
                    { k: "g", value: 38 },
                    { k: "h", value: 29 },
                    { k: "s", value: 19 },
                    { k: "r", value: 14 },
                  ]}
                />
                <p className="rs-profile-note">
                  This person is a Gryffindor with a strong Hufflepuff streak. They still play strategically and still have principles;
                  those just lose most tiebreakers.
                </p>
              </Reveal>
            </div>

            <div className="rs-sub">
              <Reveal className="rs-sub-head">
                <h3 className="rs-h3">The six collisions that reveal a house</h3>
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
            <Head
              kicker="The four houses"
              lede="Every house gets the same treatment: the driver, what it produces when it’s healthy and when it’s unchecked, how to spot one, how it behaves under stress, and a hero and a villain who run on the same engine."
            >
              Each house, in full
            </Head>
            <Reveal className="rs-doors">
              {readingOrder.map((k) => (
                <a key={k} href={`#${houses[k].id}`} className="rs-door" style={hv(k)}>
                  <span className="rs-door-glyph">
                    <Glyph active={[k]} size={18} />
                  </span>
                  <span className="rs-door-name">{houses[k].name}</span>
                  <span className="rs-door-meta">
                    <span>{houses[k].driver}</span>
                    <span aria-hidden="true">→</span>
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
            <Head
              kicker="The test case"
              lede="Put one of each house at a Monopoly table and the drivers show up within the hour. A board game works because it has everything at once: rules to follow or bend, money to grab, alliances to make, and friends to keep. Pick a round."
            >
              The Monopoly test
            </Head>
            <Reveal>
              <MonopolyTable />
            </Reveal>
          </div>
        </section>

        {/* Drivers in the wild */}
        <section id="wild" className="rs-section" data-room="none">
          <div className="rs-wrap">
            <Head
              kicker="Higher stakes"
              lede="Each house’s first instinct in four situations. None of these answers is the right one, and each of them can go wrong."
            >
              The drivers in the wild
            </Head>
            <Reveal>
              <QuadSwitch
                variant="sentence"
                label="Situations"
                prompt="Pick a situation"
                items={scenarios.map((s) => ({ title: s.title, values: { g: s.g, r: s.r, h: s.h, s: s.s } }))}
              />
            </Reveal>
          </div>
        </section>

        {/* Pairs */}
        <section id="pairs" className="rs-section" data-room="none">
          <div className="rs-wrap">
            <Head
              kicker="Relationships"
              lede="Neighbors on the map share an axis and make natural allies. Diagonal houses share nothing, which makes them the hardest pairs and the most useful to each other. Your growth edge is always across the diagonal."
            >
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
            <Head
              kicker="Applied"
              lede="Run the books’ characters through the drivers and a lot of people move. These are arguments, not rulings, and disagreeing about them is half the fun."
            >
              Hogwarts, <em>re-sorted</em>
            </Head>
            <CanonGrid />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="rs-section" data-room="none">
          <div className="rs-wrap">
            <Head kicker="Objections">Questions and edge cases</Head>
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
                  <span className="rs-kicker">
                    <Glyph active="all" size={10} />
                    28 questions · about 6 minutes
                  </span>
                  <h2 className="rs-h2">
                    The sorting <em>quiz</em>
                  </h2>
                  <p className="rs-lede">
                    Find your dominant and secondary drivers. Tap the answer that sounds most like you, then tap a second one if it also
                    fits. Your first choice is worth 3 points and your second is worth 1.
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
            <p>
              <b>Re-Sorted</b> is an unofficial fan framework for talking about characters and people. It isn’t affiliated with the Harry
              Potter books, the films, or their publishers.
            </p>
          </div>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
