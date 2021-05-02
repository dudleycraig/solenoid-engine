import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

export default ({ x, y, r = 0, title, paragraph, img, link, ...props }) => {
  return (
    <g transform={`translate(${x} ${y})`} className="mA-sensor" {...props}>
      <OverlayTrigger
        placement="top"
        overlay={
          <Popover className="svg-popover">
            <Popover.Title as="h3">{title}</Popover.Title>
            <Popover.Content className="row" style={{ overflow: 'hidden' }}>
              <div className="col-3">
                <img
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '3px',
                  }}
                  width="60px"
                  height="60px"
                  src={img}
                />
              </div>
              <p className="col auto">{paragraph}</p>
            </Popover.Content>
          </Popover>
        }
      >
        <a href={link}>
          <path d="m 3,-5 h 44 a 3,3 0 0 1 3,3 v 14 a 3,3 0 0 1 -3,3 h -44 a 3,3 0 0 1 -3,-3 v -14 a 3,3 0 0 1 3,-3 z" />
          <text x="5" y="8" className={'ic'}>
            <tspan>mA Sensor</tspan>
          </text>
        </a>
      </OverlayTrigger>
    </g>
  );
};
