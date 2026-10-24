import { houses } from "@/lib/resorted/houses";
import { diagonal, type Key } from "@/lib/resorted/model";
import DriverTree from "./DriverTree";
import Glyph from "./Glyph";
import { hv } from "./hv";
import Reveal from "./Reveal";
import { withSpokenLines } from "./quotes";

/** One house, in full. The page's room light shifts to this house while it's on screen. */
export default function HouseChapter({ k }: { k: Key }) {
  const h = houses[k];
  const edge = diagonal[k];

  return (
    <section id={h.id} className="rs-chapter" data-room={k} style={hv(k, { "--edge": `var(--${edge})` })}>
      <div className="rs-wrap">
        <Reveal>
          <span className="rs-kicker">
            <Glyph active={[k]} size={14} />
            {h.axes}
          </span>
          <h3 className="rs-chapter-name">{h.name}</h3>
          <p className="rs-chapter-driver">
            <b>{h.driverLong}</b> · {h.loyal}
          </p>
          <p className="rs-chapter-q">“{h.firstQuestion}”</p>
        </Reveal>

        <div className="rs-chapter-body">
          <div>
            <Reveal className="rs-chapter-def">
              {h.def.map((para) => (
                <p key={para.slice(0, 32)}>{withSpokenLines(para)}</p>
              ))}
            </Reveal>
            <Reveal>
              <DriverTree house={h} />
            </Reveal>
            <Reveal>
              <span className="rs-label">Same driver, both directions</span>
              <div className="rs-dirs">
                <div className="rs-dir">
                  <span className="rs-label">At its best</span>
                  <h4>{h.best.who}</h4>
                  <p>{h.best.text}</p>
                </div>
                <div className="rs-dir rs-dir-worst">
                  <span className="rs-label">At its worst</span>
                  <h4>{h.worst.who}</h4>
                  <p>{h.worst.text}</p>
                </div>
              </div>
              <p className="rs-outside">
                <span className="rs-label">Outside the books</span>
                {h.outside}
              </p>
            </Reveal>
          </div>

          <Reveal className="rs-chapter-aside" delay={120}>
            <dl className="rs-dl">
              <dt className="rs-label">How to spot one</dt>
              <dd>{withSpokenLines(h.spot)}</dd>
              <dt className="rs-label">Under stress</dt>
              <dd>{h.stress}</dd>
              <dt className="rs-label">As a group</dt>
              <dd>{h.group}</dd>
              <dt className="rs-label">Working with one</dt>
              <dd>{h.work}</dd>
            </dl>
            <div className="rs-growth">
              <div className="rs-growth-head">
                <Glyph active={[k, edge]} size={14} />
                Growth edge · across the diagonal
              </div>
              <p className="rs-growth-lead">
                <span className="edge">{houses[edge].name}</span> holds what <span className="self">{h.name}</span> lacks.
              </p>
              <p>{h.growth}</p>
            </div>
            <div className="rs-note">
              <span className="rs-label">Common misread</span>
              <p>{withSpokenLines(h.misread)}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
