import React from 'react';

export default function ActivityItem({
  icon: Icon,
  title,
  description,
  time
}) {
  return (
    <div className="activity-item">

      <div className="activity-content">

        <div className="activity-title">
          {Icon && <Icon size={17} />}

          <strong>
            {title}
          </strong>
        </div>

        <span>
          {description}
        </span>

      </div>

      {time && (
        <small>
          {time}
        </small>
      )}

    </div>
  );
}