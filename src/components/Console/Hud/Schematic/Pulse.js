import React from 'react';

export default ({ x, y, major = false, active = false, ...props }) => {
  return (
    <g transform={`translate(${x} ${y})`} className="pulse" {...props}>
      {(active && ((major && <path d="m 0,0 v -10 h 2 v 10 h 2 v -10 h 2 v 10 h 2 v -10 h 2 v 10" className="svg-active" />) || <path d="m 0,0 v -5 h 2 v 5 h 2 v -5 h 2 v 5 h 2 v -5 h 2 v 5" className="svg-active" />)) || <path d="m 0,0 h 10" />}
    </g>
  );
};
