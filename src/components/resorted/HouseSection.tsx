import { houses } from "@/lib/resorted/houses";
import { diagonal, type Key } from "@/lib/resorted/model";
import DriverTree from "./DriverTree";
import Glyph from "./Glyph";
import Reveal from "./Reveal";
import { withSpokenLines } from "./quotes";

/** One full house breakdown: tinted band, definitions, driver tree, both directions, aside. */
export default function HouseSection({ k }: { k: Key }) {
  const h = houses[k];
  const edge = diagonal[k];
  const edgeHouse = houses[edge];

  return (
    <section id={h.id} className="rs-house" style={{ "--house": `var(--${k})`, "--edge": `var(--${edge})` } as React.CSSProperties}>
      <div className="rs-house-band">
        <div className="rs-wrap">
          <Reveal>
            <div className="rs-band-top">
              <Glyph active={[k]} size={22} />
              {h.axes}
            </div>
            <h3 className="rs-house-name">{h.name}</h3>
            <p className="rs-house-driverline">
              <b>{h.driverLong}</b> · {h.loyal}
            </p>
            <p className="rs-house-q">“{h.firstQuestion}”</p>
          </Reveal>
        </div>
      </div>
      <div className="rs-wrap rs-house-body">
        <div className="rs-cols">
          <div>
            <Reveal>
              {h.def.map((para) => (
                <p key={para.slice(0, 24)} style={{ marginBottom: 16 }}>
                  {withSpokenLines(para)}
                </p>
              ))}
            </Reveal>
            <Reveal>
              <DriverTree house={h} />
            </Reveal>
            <Reveal>
              <p className="rs-eyebrow" style={{ margin: "30px 0 12px" }}>
                Same driver, both directions
              </p>
              <div className="rs-grid-2">
                <div className="rs-direction">
                  <span className="rs-dir-kicker">At its best</span>
                  <h4>{h.best.who}</h4>
                  <p>{h.best.text}</p>
                </div>
                <div className="rs-direction rs-direction-worst">
                  <span className="rs-dir-kicker">At its worst</span>
                  <h4>{h.worst.who}</h4>
                  <p>{h.worst.text}</p>
                </div>
              </div>
              <p className="rs-outside">
                <b>Outside the books</b>
                {h.outside}
              </p>
            </Reveal>
          </div>
          <Reveal className="rs-house-aside">
            <dl className="rs-spec">
              <dt>How to spot one</dt>
              <dd>{withSpokenLines(h.spot)}</dd>
              <dt>Under stress</dt>
              <dd>{h.stress}</dd>
              <dt>As a group</dt>
              <dd>{h.group}</dd>
              <dt>Working with one</dt>
              <dd>{h.work}</dd>
            </dl>
            <div className="rs-growth">
              <div className="rs-growth-head">
                <Glyph active={[k, edge]} size={16} />
                Growth edge · across the diagonal
              </div>
              <p className="rs-growth-lead">
                <em>{edgeHouse.name}</em> holds what <em>{h.name}</em> lacks.
              </p>
              <p>{h.growth}</p>
            </div>
            <div className="rs-misread">
              <span className="rs-mis-head">Common misread</span>
              <p>{withSpokenLines(h.misread)}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
