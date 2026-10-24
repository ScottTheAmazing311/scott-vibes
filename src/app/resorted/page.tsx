import Bars from "@/components/resorted/Bars";
import CanonGrid from "@/components/resorted/CanonGrid";
import Chip from "@/components/resorted/Chip";
import DriverMap from "@/components/resorted/DriverMap";
import GlanceTable from "@/components/resorted/GlanceTable";
import Glyph from "@/components/resorted/Glyph";
import HouseRow from "@/components/resorted/HouseRow";
import HouseSection from "@/components/resorted/HouseSection";
import MonopolyTable from "@/components/resorted/MonopolyTable";
import Quiz from "@/components/resorted/Quiz";
import RelationshipSquare from "@/components/resorted/RelationshipSquare";
import Reveal from "@/components/resorted/Reveal";
import { canon, capacities, collisions, pairs, scenarios } from "@/lib/resorted/content";
import { houses } from "@/lib/resorted/houses";
import { readingOrder, type Key } from "@/lib/resorted/model";
import { blends } from "@/lib/resorted/quiz-data";

const navLinks = [
  ["#idea", "Idea"],
  ["#map", "Map"],
  ["#tiebreaker", "Tiebreaker"],
  ["#houses", "Houses"],
  ["#monopoly", "Monopoly"],
  ["#pairs", "Pairs"],
  ["#canon", "Canon"],
  ["#faq", "FAQ"],
] as const;

const originalDeal = [
  { k: "g" as Key, traits: "brave, daring, chivalrous", reads: "all compliments", villain: false },
  { k: "r" as Key, traits: "wit, learning, wisdom", reads: "all compliments", villain: false },
  { k: "h" as Key, traits: "loyal, patient, hard-working", reads: "quiet compliments", villain: false },
  { k: "s" as Key, traits: "cunning, ambitious, any means necessary", reads: "a villain’s résumé", villain: true },
];

const principles = [
  { title: "One driver per house", text: "A motivating force, not a trait. It explains why someone acts, not just how it looks." },
  { title: "Every driver cuts both ways", text: "The same driver has to produce a hero and a villain, or it’s padding." },
  { title: "No free passes", text: "Each house is equally compelling to join and equally problematic to be." },
  { title: "Sort by tiebreaker", text: "Everyone uses all four. Your house is the one that wins when they collide." },
];

const axesCards = [
  { title: "Heart", text: "Decides by instinct and feeling. Trusts the gut or the people in the room.", chips: ["g", "h"] as Key[] },
  { title: "Head", text: "Decides by analysis. Wants it to make sense before acting on it.", chips: ["r", "s"] as Key[] },
  { title: "Self", text: "Answers to their own conviction or their own goals.", chips: ["g", "s"] as Key[] },
  { title: "Beyond self", text: "Answers to something bigger: a code or a community.", chips: ["r", "h"] as Key[] },
];

const squarePoints = [
  {
    title: "Why Gryffindor and Slytherin are the rivalry",
    text: "They’re the two houses that answer to themselves, so they compete for the same thing: who leads. The only difference is method, gut versus plan.",
  },
  {
    title: "Why Ravenclaw and Hufflepuff sit in the background",
    text: "Both defer to something outside themselves, a code or a community. They rarely grab the spotlight, because the spotlight isn’t what they answer to.",
  },
  {
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

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal>
      <p className="rs-eyebrow">{eyebrow}</p>
      <h2 className="rs-h2">{title}</h2>
    </Reveal>
  );
}

export default function ResortedPage() {
  return (
    <>
      <header className="rs-topbar">
        <div className="rs-wrap rs-topbar-in">
          <a href="#top" className="rs-wordmark">
            <Glyph active="all" size={16} />
            <span>RE-SORTED</span>
          </a>
          <nav className="rs-nav" aria-label="Sections">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
            <a href="#quiz" className="rs-nav-cta">
              Take the quiz
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="rs-wrap rs-hero">
          <div className="rs-hero-grid">
            <Reveal>
              <p className="rs-eyebrow">An unofficial re-sorting of the four houses</p>
              <h1 className="rs-h1">Every house runs on one driver.</h1>
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
              <p className="rs-statline">
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
            <Reveal delay={120}>
              <DriverMap />
            </Reveal>
          </div>
        </section>

        {/* The problem */}
        <section id="idea" className="rs-section">
          <div className="rs-wrap">
            <SectionHead eyebrow="The problem" title="Why the original four don’t work" />
            <div className="rs-cols">
              <Reveal>
                <p style={{ marginBottom: 16 }}>
                  The classic house traits aren’t a fair fight. Gryffindor gets bravery, daring and chivalry, which are all compliments.
                  Slytherin gets cunning and ambition, which is the vocabulary you’d use to describe the devil. With the deck stacked
                  like that, everyone wants the same house and nobody wants the other one.
                </p>
                <p style={{ marginBottom: 16 }}>
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
              <Reveal delay={100}>
                <p className="rs-eyebrow" style={{ marginBottom: 10 }}>
                  The original deal
                </p>
                <table className="rs-table">
                  <thead>
                    <tr>
                      <th scope="col">House</th>
                      <th scope="col">Classic traits</th>
                      <th scope="col">Reads as</th>
                    </tr>
                  </thead>
                  <tbody>
                    {originalDeal.map((row) => (
                      <tr key={row.k}>
                        <td className="rs-deal-house" style={{ color: `var(--${row.k})` }}>
                          {houses[row.k].name}
                        </td>
                        <td>{row.traits}</td>
                        <td>{row.villain ? <b>{row.reads}</b> : row.reads}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="rs-deal-note">
                  Three houses get padded lists of virtues and one gets a warning label. The re-sort gives every house one neutral driver
                  that cuts both ways.
                </p>
              </Reveal>
            </div>
            <Reveal>
              <div className="rs-principles">
                {principles.map((p) => (
                  <div key={p.title} className="rs-principle">
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal>
              <h3 className="rs-subhead">Same virtue, four drivers</h3>
              <p className="rs-lede" style={{ fontSize: 17, color: "var(--muted)" }}>
                Every classic house trait shows up in every house. The driver changes what it looks like.
              </p>
            </Reveal>
            <div className="rs-grid-2" style={{ marginTop: 10 }}>
              {capacities.map((cap, i) => (
                <Reveal key={cap.title} delay={(i % 2) * 90} className="rs-card">
                  <h3 className="rs-h3">{cap.title}</h3>
                  {readingOrder.map((k) => (
                    <HouseRow key={k} k={k}>
                      {cap[k]}
                    </HouseRow>
                  ))}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* The structure */}
        <section id="map" className="rs-section">
          <div className="rs-wrap">
            <SectionHead eyebrow="The structure" title="Two questions sit underneath the four houses" />
            <Reveal>
              <p className="rs-lede">
                Do you decide with your head or your heart? And do you answer to yourself, or to something beyond yourself? Plot the four
                drivers on those two axes and they land one per corner. The houses stop being a list and become a map.
              </p>
            </Reveal>
            <Reveal>
              <div className="rs-axes">
                {axesCards.map((a) => (
                  <div key={a.title} className="rs-card rs-axis-card">
                    <h3>{a.title}</h3>
                    <p>{a.text}</p>
                    <div className="rs-chiprow">
                      {a.chips.map((k) => (
                        <Chip key={k} k={k}>
                          {houses[k].name}
                        </Chip>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <div className="rs-cols">
              <Reveal>
                <RelationshipSquare />
                <p className="rs-map-caption">
                  Neighbors share one axis and get along. The dashed diagonals share nothing, which is where the friction lives.
                </p>
              </Reveal>
              <Reveal delay={100} className="rs-sq-points">
                {squarePoints.map((p) => (
                  <div key={p.title}>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </div>
                ))}
              </Reveal>
            </div>
            <Reveal>
              <h3 className="rs-subhead">Four serious ethical traditions</h3>
              <p className="rs-lede" style={{ fontSize: 17, color: "var(--muted)" }}>
                Each driver lines up with a real school of moral thought. That’s the strongest case that no house is the default good
                one: each tradition is respectable, and each has a famous way of going wrong.
              </p>
            </Reveal>
            <div className="rs-grid-4" style={{ marginTop: 10 }}>
              {traditions.map((t, i) => (
                <Reveal key={t.k} delay={i * 70}>
                  <div className="rs-tradition" style={{ "--house": `var(--${t.k})` } as React.CSSProperties}>
                    <span className="rs-trad-house">{houses[t.k].name}</span>
                    <h3>{t.name}</h3>
                    <p>{t.text}</p>
                    <p className="rs-trad-fail">
                      <b>Fails as</b> {t.fails}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* How sorting works */}
        <section id="tiebreaker" className="rs-section">
          <div className="rs-wrap">
            <SectionHead eyebrow="How sorting works" title="Everyone runs all four drivers" />
            <div className="rs-cols">
              <Reveal>
                <p className="rs-lede">
                  Nobody is purely bold or purely strategic. Most everyday choices don’t force a ranking, because the bold move, the
                  right move, the kind move and the smart move are often the same move. A house only shows up when drivers collide. Your
                  house is the driver that wins the tie.
                </p>
                <p className="rs-pullnote" style={{ marginTop: 26 }}>
                  Dumbledore once wondered aloud to Snape whether they sort too soon. This framework agrees. Watch someone when two
                  drivers point in different directions and you’ll see their house.
                </p>
              </Reveal>
              <Reveal delay={100} className="rs-card">
                <p className="rs-eyebrow" style={{ marginBottom: 16 }}>
                  An example profile
                </p>
                <Bars
                  data={[
                    { k: "g", value: 38, display: "38" },
                    { k: "h", value: 29, display: "29" },
                    { k: "s", value: 19, display: "19" },
                    { k: "r", value: 14, display: "14" },
                  ]}
                  big
                />
                <p style={{ fontSize: 15, color: "var(--muted)", marginTop: 16 }}>
                  This person is a Gryffindor with a strong Hufflepuff streak. They still play strategically and still have principles;
                  those just lose most tiebreakers.
                </p>
              </Reveal>
            </div>
            <Reveal>
              <h3 className="rs-subhead">The six collisions that reveal a house</h3>
            </Reveal>
            <div className="rs-grid-2" style={{ marginTop: 18 }}>
              {collisions.map((c, i) => (
                <Reveal key={`${c.a}${c.b}`} delay={(i % 2) * 90}>
                  <div className="rs-card rs-collision">
                    <div className="rs-col-vs">
                      <Glyph active={[c.a, c.b]} size={16} />
                      <span>
                        <span style={{ color: `var(--${c.a})` }}>{houses[c.a].driver}</span> vs.{" "}
                        <span style={{ color: `var(--${c.b})` }}>{houses[c.b].driver}</span>
                      </span>
                    </div>
                    <p>{c.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* The four houses */}
        <section id="houses" className="rs-section" style={{ paddingBottom: 0 }}>
          <div className="rs-wrap">
            <SectionHead eyebrow="The four houses" title="Each house, in full" />
            <Reveal>
              <p className="rs-lede">
                Every house gets the same treatment: the driver, what it produces when it’s healthy and when it’s unchecked, how to spot
                one, how it behaves under stress, and a hero and a villain who run on the same engine.
              </p>
            </Reveal>
            <Reveal>
              <div style={{ marginTop: 26 }}>
                <GlanceTable />
              </div>
              <div className="rs-jumplinks">
                {readingOrder.map((k) => (
                  <a key={k} href={`#${houses[k].id}`} className="rs-jumplink" style={{ "--house": `var(--${k})` } as React.CSSProperties}>
                    <Glyph active={[k]} size={14} />
                    {houses[k].name} →
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
          <div style={{ marginTop: 56 }}>
            {readingOrder.map((k) => (
              <HouseSection key={k} k={k} />
            ))}
          </div>
        </section>

        {/* Monopoly */}
        <section id="monopoly" className="rs-section">
          <div className="rs-wrap">
            <SectionHead eyebrow="The test case" title="The Monopoly test" />
            <Reveal>
              <p className="rs-lede">
                Put one of each house at a Monopoly table and the drivers show up within the hour. A board game works because it has
                everything at once: rules to follow or bend, money to grab, alliances to make, and friends to keep. Pick a round.
              </p>
            </Reveal>
            <Reveal>
              <MonopolyTable />
            </Reveal>
          </div>
        </section>

        {/* Drivers in the wild */}
        <section id="wild" className="rs-section">
          <div className="rs-wrap">
            <SectionHead eyebrow="Higher stakes" title="The drivers in the wild" />
            <Reveal>
              <p className="rs-lede">
                Each house’s first instinct in four situations. None of these answers is the right one, and each of them can go wrong.
              </p>
            </Reveal>
            <div className="rs-grid-2" style={{ marginTop: 18 }}>
              {scenarios.map((sc, i) => (
                <Reveal key={sc.title} delay={(i % 2) * 90} className="rs-card">
                  <h3 className="rs-h3">{sc.title}</h3>
                  {readingOrder.map((k) => (
                    <HouseRow key={k} k={k}>
                      {sc[k]}
                    </HouseRow>
                  ))}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Pairs */}
        <section id="pairs" className="rs-section">
          <div className="rs-wrap">
            <SectionHead eyebrow="Relationships" title="How the houses get along" />
            <Reveal>
              <p className="rs-lede">
                Neighbors on the map share an axis and make natural allies. Diagonal houses share nothing, which makes them the hardest
                pairs and the most useful to each other. Your growth edge is always across the diagonal.
              </p>
            </Reveal>
            <div className="rs-grid-2" style={{ marginTop: 18 }}>
              {pairs.map((p, i) => (
                <Reveal key={`${p.a}${p.b}`} delay={(i % 2) * 90}>
                  <div className={`rs-card rs-pair${p.diagonal ? " rs-pair-diag" : ""}`}>
                    <div className="rs-pair-head">
                      <Glyph active={[p.a, p.b]} size={18} />
                      <h3>
                        <span style={{ color: `var(--${p.a})` }}>{houses[p.a].name}</span> +{" "}
                        <span style={{ color: `var(--${p.b})` }}>{houses[p.b].name}</span>
                      </h3>
                    </div>
                    <span className="rs-pair-kind">
                      {p.kind} · {p.share}
                    </span>
                    <p>{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Canon */}
        <section id="canon" className="rs-section">
          <div className="rs-wrap">
            <SectionHead eyebrow="Applied" title="Hogwarts, re-sorted" />
            <Reveal>
              <p className="rs-lede">
                Run the books’ characters through the drivers and a lot of people move. These are arguments, not rulings, and disagreeing
                about them is half the fun.
              </p>
            </Reveal>
            <Reveal>
              <CanonGrid />
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="rs-section">
          <div className="rs-wrap">
            <SectionHead eyebrow="Objections" title="Questions and edge cases" />
            <div className="rs-faq">
              {faq.map((item, i) => (
                <Reveal key={item.q} delay={(i % 2) * 70} className="rs-faq-item">
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Quiz */}
        <section id="quiz" className="rs-section">
          <div className="rs-wrap">
            <SectionHead eyebrow="28 questions · about 6 minutes" title="The sorting quiz" />
            <Reveal>
              <p className="rs-lede">
                Find your dominant and secondary drivers. Tap the answer that sounds most like you, then tap a second one if it also
                fits. Your first choice is worth 3 points and your second is worth 1.
              </p>
            </Reveal>
            <Quiz />
          </div>
        </section>
      </main>

      <footer className="rs-footer">
        <div className="rs-wrap rs-footer-in">
          <p>
            <b>Re-Sorted</b> is an unofficial fan framework for talking about characters and people. It isn’t affiliated with the Harry
            Potter books, the films, or their publishers.
          </p>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
