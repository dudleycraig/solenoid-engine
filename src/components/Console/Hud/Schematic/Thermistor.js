import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

export default ({ x, y, title, paragraph, img, link, ...props }) => {
  return (
    <g transform={`translate(${x} ${y})`} className="thermistor" {...props}>
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
          <path className="hidden" d="m -4,-5 h 20 a 5,5 0 0 1 5,5 v 0 a 5,5 0 0 1 -5,5 h -20 a 5,5 0 0 1 -5,-5 v -0 a 5,5 0 0 1 5,-5 z" />
          <path d="m 0,0 h 1 L 2,-2 4,2 6,-2 8,2 10,-2 12,2 13,0 h 1" />
          <path d="m 0,4 h 4 l 10,-8" />
        </a>
      </OverlayTrigger>
    </g>
  );
};
