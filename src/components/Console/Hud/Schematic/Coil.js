import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

export default ({ x, y, title, paragraph, img, link, ...props }) => {
  return (
    <g transform={`translate(${x} ${y})`} className="coil" {...props}>
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
        <a href={`${link}/construction/electronics`}>
          <path className="hidden" d="m 30,-5 h 20 a 5,5 0 0 1 5,5 v 0 a 5,5 0 0 1 -5,5 h -20 a 5,5 0 0 1 -5,-5 v -0 a 5,5 0 0 1 5,-5 z" />
          <path d="m 0,0 h 28" />
          <path d="m 28,0 c 0,3 6,3 6,0" />
          <path d="m 34,0 c 0,3 6,3 6,0" />
          <path d="m 40,0 c 0,3 6,3 6,0" />
          <path d="m 46,0 c 0,3 6,3 6,0" />
          <path d="m 52,0 h 33" />
        </a>
      </OverlayTrigger>
    </g>
  );
};
