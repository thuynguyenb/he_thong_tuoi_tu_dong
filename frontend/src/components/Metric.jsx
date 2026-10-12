import React from 'react';

export default function Metric({
  icon: Icon,
  label,
  value,
  unit,
  color
}) {
  return (
    <div className="metric">
      <div
        className="metric-icon"
        style={color ? { color } : undefined}
      >
        <Icon size={22} />
      </div>

      <div className="metric-content">
        <span className="metric-label">
          {label}
        </span>

        <div className="metric-value">
          <strong>{value}</strong>

          {unit && (
            <small>{unit}</small>
          )}
        </div>
      </div>
    </div>
  );
}