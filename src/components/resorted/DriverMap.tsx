import { houses } from "@/lib/resorted/houses";
import { mapOrder } from "@/lib/resorted/model";

/** The hero's interactive 2×2: four quadrant links around a central "a decision" circle. */
export default function DriverMap() {
  return (
    <div>
      <div className="rs-map">
        <div className="rs-map-head">
          <div>
            <span className="rs-axlab">Heart</span>
            <span className="rs-axsub">decides by instinct &amp; feeling</span>
          </div>
          <div>
            <span className="rs-axlab">Head</span>
            <span className="rs-axsub">decides by analysis</span>
          </div>
        </div>
        <div className="rs-map-side">
          <div>
            <span className="rs-axlab">Self</span>
            <span className="rs-axsub">answers to me</span>
          </div>
          <div>
            <span className="rs-axlab">Beyond self</span>
            <span className="rs-axsub">answers to more</span>
          </div>
        </div>
        <div className="rs-map-quads">
          {mapOrder.map((k) => {
            const h = houses[k];
            return (
              <a key={k} href={`#${h.id}`} className="rs-quad" style={{ "--house": `var(--${k})` } as React.CSSProperties}>
                <span className="rs-quad-name">{h.name}</span>
                <span className="rs-quad-driver">{h.driver}</span>
                <span className="rs-quad-q">{h.firstQuestion}</span>
              </a>
            );
          })}
          <div className="rs-map-center" aria-hidden="true">
            a decision
          </div>
        </div>
      </div>
      <p className="rs-map-caption">Every hard decision sends you to one of four questions first. That question is your house.</p>
    </div>
  );
}
