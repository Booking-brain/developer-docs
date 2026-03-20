import React from 'react';

const steps = [
  {num: '1', label: 'Search', endpoint: 'GET /search', color: '#00a67d'},
  {num: '2', label: 'Property Detail', endpoint: 'GET /properties/{id}', color: '#015A9C'},
  {num: '3', label: 'Check Availability', endpoint: 'GET /unavailableDates', color: '#7b61ff'},
  {num: '4', label: 'Calculate Price', endpoint: 'POST /get-price', color: '#e8912d'},
  {num: '5', label: 'Create Booking', endpoint: 'POST /bookings/save', color: '#015A9C'},
  {num: '6', label: 'Process Payment', endpoint: 'POST /processPayment', color: '#00a67d'},
];

export default function BookingFlowDiagram(): React.ReactElement {
  const stepWidth = 140;
  const stepHeight = 80;
  const gap = 28;
  const arrowLen = gap;
  const topPad = 20;
  const leftPad = 16;
  const totalWidth = steps.length * stepWidth + (steps.length - 1) * gap + leftPad * 2;
  const totalHeight = stepHeight + topPad * 2 + 28;

  return (
    <div style={{overflowX: 'auto', margin: '1.5rem 0'}}>
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        width="100%"
        style={{minWidth: 800, maxWidth: totalWidth, display: 'block'}}
        role="img"
        aria-label="Booking flow diagram showing 6 steps: Search, Property Detail, Check Availability, Calculate Price, Create Booking, Process Payment"
      >
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="var(--bb-gray-400, #a1a1a6)" />
          </marker>
          <filter id="stepShadow" x="-4%" y="-4%" width="108%" height="116%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
          </filter>
        </defs>

        {steps.map((step, i) => {
          const x = leftPad + i * (stepWidth + gap);
          const y = topPad;
          const cx = x + stepWidth / 2;
          const cy = y + stepHeight / 2;

          return (
            <g key={i}>
              {/* Card */}
              <rect
                x={x} y={y}
                width={stepWidth} height={stepHeight}
                rx={10} ry={10}
                fill="var(--bb-surface-primary, #fff)"
                stroke={step.color}
                strokeWidth={2}
                filter="url(#stepShadow)"
              />

              {/* Step number badge */}
              <circle cx={x + 18} cy={y + 18} r={11} fill={step.color} />
              <text x={x + 18} y={y + 22} textAnchor="middle" fill="#fff"
                    fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700">
                {step.num}
              </text>

              {/* Label */}
              <text x={cx} y={y + 42} textAnchor="middle"
                    fill="var(--bb-gray-900, #1d1d1f)"
                    fontFamily="Inter, sans-serif" fontSize="12.5" fontWeight="700">
                {step.label}
              </text>

              {/* Endpoint */}
              <text x={cx} y={y + 58} textAnchor="middle"
                    fill="var(--bb-gray-400, #a1a1a6)"
                    fontFamily="JetBrains Mono, monospace" fontSize="8.5" fontWeight="500">
                {step.endpoint}
              </text>

              {/* Arrow to next step */}
              {i < steps.length - 1 && (
                <line
                  x1={x + stepWidth + 4} y1={cy}
                  x2={x + stepWidth + arrowLen - 4} y2={cy}
                  stroke="var(--bb-gray-400, #a1a1a6)"
                  strokeWidth={1.5}
                  markerEnd="url(#arrowhead)"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
