import React from 'react';

export default ({ width=50, height=30, ...props}) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} {...props}>
    <path d="m15 1v4" />
    <path d="m15 0v6" />
    <path d="m20 1v4" />
    <path d="m20 0v6" />
    <path d="m25 1v4" />
    <path d="m25 0v6" />
    <path d="m15 25v4" />
    <path d="m15 24v6" />
    <path d="m21 25v4" />
    <path d="m21 24v6" />
    <path d="m26 25v4" />
    <path d="m26 24v6" />
  </svg>
);
