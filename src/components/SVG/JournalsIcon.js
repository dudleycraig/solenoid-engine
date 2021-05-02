import React from 'react';

export default ({ width=50, height=30, ...props}) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} {...props}>
    <circle cx="15.042" cy="14.988" r=".5" />
    <circle cx="19.97" cy="15.01" r=".5" />
    <circle cx="25.014" cy="14.996" r=".5" />
    <circle cx="31.066" cy="15.065" r=".5" />
    <circle cx="38.981" cy="14.993" r=".5" />
    <circle cx="42.997" cy="15.025" r=".5" />
    <circle cx="7.0288" cy="15.027" r=".5" />
  </svg>
);
