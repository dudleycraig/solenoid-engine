import React from 'react';

export default ({ x, y, r = 0, ...props }) => {
  return (
    <g className="arrow" transform={`translate(${x} ${y}) rotate(${r}, 0, 0)`} className="arrow" {...props}>
      <path d="m 2,0 l -4,1 l 0,-2 z" style={{ fill: 'rgba(200,200,200,0.8)' }} />
    </g>
  );
};
