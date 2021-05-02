import React from 'react';

export default ({ width=50, height=30, ...props}) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} {...props}>
    <path d="m6 15h38" />
    <path d="m35 10v10" />
  </svg>
);
