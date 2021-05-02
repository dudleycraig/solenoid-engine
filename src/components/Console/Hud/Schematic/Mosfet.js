import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import Arrow from './Arrow';

export default ({ x, y, title, paragraph, img, link, ...props }) => {
  return (
    <g transform={`translate(${x} ${y})`} className="mosfet" {...props}>
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
          <circle cx="20" cy="0" r="10" />
          <path d="m 0,5 h 18 v -10" />
          <path d="m 20,-7 v 14" />
          <circle className="dot" r="0.5" cy="5" cx="25" />
          <path d="m 20,5 h 5" />
          <path d="m 25,5 v -5" />
          <path d="m 25,0 h -3" />
          <Arrow x="22" y="0" r="180" />
          <path d="m 20,-5 h 20" />
          <path d="m 25,5 h 30" />
        </a>
      </OverlayTrigger>
    </g>
  );
};
