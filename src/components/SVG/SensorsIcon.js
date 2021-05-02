import React from 'react';

export default ({ width=50, height=30, ...props}) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} {...props}>
    <path d="m35 1v9" />
    <path d="m35 20v9" />
    <path d="m32 20h6" />
    <path d="m32 10h6" />
    <path d="m40 15h10" />
    <path d="m40 12v6" />
  </svg>
);
