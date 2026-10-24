import type { House } from "@/lib/resorted/houses";

/**
 * The driver splitting into what it produces healthy and unchecked. The
 * square marks the unchecked items that hurt other people, so it's visible
 * that every house harms others, not only itself.
 */
export default function DriverTree({ house }: { house: House }) {
  return (
    <div className="rs-tree">
      <div className="rs-tree-root">
        <span className="rs-label">Driver</span>
        <span className="rs-tree-name">{house.driver}</span>
      </div>
      <svg className="rs-tree-fork" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M50 0 C50 22 25 16 25 40 M50 0 C50 22 75 16 75 40" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="rs-tree-branches">
        <div className="rs-branch rs-branch-plus">
          <p className="rs-branch-head">Healthy</p>
          <ul>
            {house.healthy.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rs-branch rs-branch-minus">
          <p className="rs-branch-head">Unchecked</p>
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
