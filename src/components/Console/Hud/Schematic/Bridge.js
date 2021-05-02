import React from 'react';

export default ({ x, y, r = 0, ...props }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}, 0, 0)`} className="bridge" {...props}>
    <path d="m 0,0 h 2" />
    <path d="m 2,0 c 0,-3 6,-3 6,0" />
    <path d="m 8,0 h 2" />
  </g>
);
