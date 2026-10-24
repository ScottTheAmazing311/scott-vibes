import type { House } from "@/lib/resorted/houses";

/**
 * The per-house driver tree: a pill root splitting into Healthy and Unchecked
 * branches. Unchecked items that hurt other people carry a filled square,
 * because every house harms others when unchecked, not only itself.
 */
export default function DriverTree({ house }: { house: House }) {
  return (
    <div className="rs-tree">
      <div className="rs-tree-root">
        <span className="rs-tree-eyebrow">Driver</span>
        {house.driver}
      </div>
      <div className="rs-tree-stem" aria-hidden="true" />
      <div className="rs-tree-branches">
        <div className="rs-branch rs-branch-plus">
          <div className="rs-branch-head">Healthy</div>
          <ul>
            {house.healthy.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rs-branch rs-branch-minus">
          <div className="rs-branch-head">Unchecked</div>
          <ul>
            {house.unchecked.map((item) => (
              <li key={item.text}>
                {item.text}
                {item.hurtsOthers && (
                  <>
                    <span className="rs-harm" aria-hidden="true" />
                    <span className="sr-only"> (hurts other people)</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="rs-tree-key">
        <span className="rs-harm" aria-hidden="true" />
        Hurts other people, not just themselves.
      </p>
    </div>
  );
}
