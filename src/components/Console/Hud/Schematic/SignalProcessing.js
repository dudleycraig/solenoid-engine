import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

export default ({ x, y, title, paragraph, img, link, ...props }) => {
  return (
    <g transform={`translate(${x} ${y})`} id="signal-processing" {...props}>
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
          <path d="m 5,0 h 120 a 5,5 0 0 1 5,5 v 20 a 5,5 0 0 1 -5,5 h -120 a 5,5 0 0 1 -5,-5 v -20 a 5,5 0 0 1 5,-5 z" />
          <text className="processing" x="4" y="19">
            <tspan>Signal Processing</tspan>
          </text>
        </a>
      </OverlayTrigger>
    </g>
  );
};
