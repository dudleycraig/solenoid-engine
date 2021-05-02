import React from 'react';

export default ({ width=50, height=30, ...props}) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} {...props}>
    <path d="m15 1v6" />
    <path d="m15 8v3" />
    <path d="m15 12v3" />
    <path d="m14 15h3" />
    <path d="m16 16v2" />
    <path d="m16 19v3" />
    <path d="m16 23v6" />
    <path d="m20 1v6" />
    <path d="m20 8v3" />
    <path d="m20 12v3" />
    <path d="m19 15h3" />
    <path d="m21 16v2" />
    <path d="m21 19v3" />
    <path d="m21 23v6" />
    <path d="m25 1v6" />
    <path d="m25 8v3" />
    <path d="m25 12v3" />
    <path d="m24 15h3" />
    <path d="m26 16v2" />
    <path d="m26 19v3" />
    <path d="m26 23v6" />
  </svg>
);
