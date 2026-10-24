/** The map's relationship diagram: four house nodes, labeled edges, dashed diagonals. */
export default function RelationshipSquare() {
  return (
    <svg
      className="rs-square"
      viewBox="0 0 380 332"
      role="img"
      aria-label="Relationship square. Gryffindor and Slytherin share Self and are rivals. Gryffindor and Hufflepuff share Heart. Slytherin and Ravenclaw share Head. Hufflepuff and Ravenclaw share Beyond self. The diagonals, Gryffindor to Ravenclaw and Slytherin to Hufflepuff, are opposite on both axes."
    >
      <line className="sq-diag" x1="128" y1="78" x2="252" y2="254" />
      <line className="sq-diag" x1="252" y1="78" x2="128" y2="254" />
      <line className="sq-edge" x1="128" y1="56" x2="252" y2="56" />
      <line className="sq-edge" x1="128" y1="276" x2="252" y2="276" />
      <line className="sq-edge" x1="68" y1="78" x2="68" y2="254" />
      <line className="sq-edge" x1="312" y1="78" x2="312" y2="254" />
      <text className="sq-lab" x="190" y="46" textAnchor="middle">
        RIVALS
      </text>
      <text className="sq-sub" x="190" y="73" textAnchor="middle">
        share Self
      </text>
      <text className="sq-lab" x="190" y="266" textAnchor="middle">
        STEADY ALLIES
      </text>
      <text className="sq-sub" x="190" y="294" textAnchor="middle">
        share Beyond self
      </text>
      <text className="sq-lab" x="60" y="166" textAnchor="middle" transform="rotate(-90 60 166)">
        HEART ALLIES
      </text>
      <text className="sq-sub" x="85" y="166" textAnchor="middle" transform="rotate(-90 85 166)">
        share Heart
      </text>
      <text className="sq-lab" x="330" y="166" textAnchor="middle" transform="rotate(90 330 166)">
        HEAD ALLIES
      </text>
      <text className="sq-sub" x="305" y="166" textAnchor="middle" transform="rotate(90 305 166)">
        share Head
      </text>
      <rect className="sq-center" x="122" y="146" width="136" height="42" rx="4" />
      <text className="sq-lab" x="190" y="164" textAnchor="middle">
        DIAGONALS
      </text>
      <text className="sq-sub" x="190" y="180" textAnchor="middle">
        opposite on both axes
      </text>
      <g>
        <rect x="8" y="34" width="120" height="44" rx="5" style={{ fill: "color-mix(in srgb, var(--g) 13%, var(--surface))", stroke: "var(--g)", strokeWidth: 1.5 }} />
        <text className="sq-name" x="68" y="61" textAnchor="middle" style={{ fill: "var(--g)" }}>
          Gryffindor
        </text>
      </g>
      <g>
        <rect x="252" y="34" width="120" height="44" rx="5" style={{ fill: "color-mix(in srgb, var(--s) 13%, var(--surface))", stroke: "var(--s)", strokeWidth: 1.5 }} />
        <text className="sq-name" x="312" y="61" textAnchor="middle" style={{ fill: "var(--s)" }}>
          Slytherin
        </text>
      </g>
      <g>
        <rect x="8" y="254" width="120" height="44" rx="5" style={{ fill: "color-mix(in srgb, var(--h) 13%, var(--surface))", stroke: "var(--h)", strokeWidth: 1.5 }} />
        <text className="sq-name" x="68" y="281" textAnchor="middle" style={{ fill: "var(--h)" }}>
          Hufflepuff
        </text>
      </g>
      <g>
        <rect x="252" y="254" width="120" height="44" rx="5" style={{ fill: "color-mix(in srgb, var(--r) 13%, var(--surface))", stroke: "var(--r)", strokeWidth: 1.5 }} />
        <text className="sq-name" x="312" y="281" textAnchor="middle" style={{ fill: "var(--r)" }}>
          Ravenclaw
        </text>
      </g>
    </svg>
  );
}
