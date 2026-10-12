import React from 'react';

export default function CardHeader({
  icon: Icon,
  title,
  subtitle
}) {
  return (
    <div className="card-header">
      <div className="card-header-icon">
        <Icon size={20} />
      </div>

      <div>
        <h3>{title}</h3>

        {subtitle && (
          <p>{subtitle}</p>
        )}
      </div>
    </div>
  );
}