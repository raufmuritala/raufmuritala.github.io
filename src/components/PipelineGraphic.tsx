/**
 * The site's signature visual: a live pipeline DAG where data pulses flow
 * Sources → Bronze → Silver → Gold → BI. The bronze/silver/gold stages are
 * the Medallion Architecture — the same pattern used in the PayVault project.
 * Animation is pure CSS (see globals.css) and respects reduced motion.
 */
export default function PipelineGraphic() {
  return (
    <svg
      viewBox="0 0 640 300"
      className="w-full h-auto"
      role="img"
      aria-label="Animated diagram of a data pipeline flowing from sources through bronze, silver, and gold layers to analytics"
    >
      <defs>
        <linearGradient id="edge-bronze" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5d6880" />
          <stop offset="100%" stopColor="#c2824f" />
        </linearGradient>
        <linearGradient id="edge-silver" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c2824f" />
          <stop offset="100%" stopColor="#a9b6c9" />
        </linearGradient>
        <linearGradient id="edge-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a9b6c9" />
          <stop offset="100%" stopColor="#e4b05c" />
        </linearGradient>
      </defs>

      {/* ---- edges (static rails) ---- */}
      <g stroke="#202938" strokeWidth="2" fill="none">
        <path d="M96 60 C 160 60, 160 120, 224 120" />
        <path d="M96 150 L 224 150" />
        <path d="M96 240 C 160 240, 160 180, 224 180" />
        <path d="M288 150 L 384 150" />
        <path d="M448 150 L 544 150" />
        <path d="M576 150 C 600 150, 600 100, 622 100" />
        <path d="M576 150 C 600 150, 600 200, 622 200" />
      </g>

      {/* ---- edges (animated pulses) ---- */}
      <g strokeWidth="2" fill="none" strokeLinecap="round">
        <path className="pipe-flow" d="M96 60 C 160 60, 160 120, 224 120" stroke="url(#edge-bronze)" />
        <path className="pipe-flow-slow" d="M96 150 L 224 150" stroke="url(#edge-bronze)" />
        <path className="pipe-flow" d="M96 240 C 160 240, 160 180, 224 180" stroke="url(#edge-bronze)" />
        <path className="pipe-flow-slow" d="M288 150 L 384 150" stroke="url(#edge-silver)" />
        <path className="pipe-flow" d="M448 150 L 544 150" stroke="url(#edge-gold)" />
        <path className="pipe-flow-slow" d="M576 150 C 600 150, 600 100, 622 100" stroke="#e4b05c" />
        <path className="pipe-flow" d="M576 150 C 600 150, 600 200, 622 200" stroke="#e4b05c" />
      </g>

      {/* ---- source nodes ---- */}
      <g fontFamily="var(--font-mono)" fontSize="11">
        {[
          { y: 60, label: "events" },
          { y: 150, label: "transactions" },
          { y: 240, label: "fx_rates" },
        ].map((s) => (
          <g key={s.label}>
            <rect x="8" y={s.y - 16} width="88" height="32" rx="6" fill="#10141e" stroke="#202938" />
            <text x="52" y={s.y + 4} textAnchor="middle" fill="#94a0b8">
              {s.label}
            </text>
          </g>
        ))}
      </g>

      {/* ---- medallion layers ---- */}
      <g fontFamily="var(--font-mono)" fontSize="11" textAnchor="middle">
        <g>
          <rect x="224" y="118" width="64" height="64" rx="10" fill="#10141e" stroke="#c2824f" />
          <circle className="node-glow" cx="256" cy="142" r="5" fill="#c2824f" />
          <text x="256" y="170" fill="#c2824f">bronze</text>
        </g>
        <g>
          <rect x="384" y="118" width="64" height="64" rx="10" fill="#10141e" stroke="#a9b6c9" />
          <circle className="node-glow" cx="416" cy="142" r="5" fill="#a9b6c9" style={{ animationDelay: "0.5s" }} />
          <text x="416" y="170" fill="#a9b6c9">silver</text>
        </g>
        <g>
          <rect x="544" y="118" width="64" height="64" rx="10" fill="#161b29" stroke="#e4b05c" strokeWidth="1.5" />
          <circle className="node-glow" cx="576" cy="142" r="5" fill="#e4b05c" style={{ animationDelay: "1s" }} />
          <text x="576" y="170" fill="#e4b05c">gold</text>
        </g>
      </g>

      {/* ---- consumers ---- */}
      <g fontFamily="var(--font-mono)" fontSize="10" textAnchor="start" fill="#94a0b8">
        <text x="624" y="104" textAnchor="end" />
        <circle cx="628" cy="100" r="3" fill="#e4b05c" opacity="0.8" />
        <circle cx="628" cy="200" r="3" fill="#e4b05c" opacity="0.8" />
      </g>
      <g fontFamily="var(--font-mono)" fontSize="10" fill="#5d6880">
        <text x="612" y="86" textAnchor="end">analytics</text>
        <text x="612" y="222" textAnchor="end">dashboards</text>
      </g>
    </svg>
  );
}
