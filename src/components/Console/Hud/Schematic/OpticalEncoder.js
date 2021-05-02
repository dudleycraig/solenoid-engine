import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

export default ({ x, y, title, paragraph, img, link, ...props }) => {
  return (
    <g transform={`translate(${x} ${y})`} id="optical-encoder" {...props}>
      <path d="m 0,0 h 5 v -10 h 10 v 10 h 10 v -10 h 10 v 10 h 5" />
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
          <circle cx="20" cy="0" r="21" style={{ strokeWidth: 1 }} />
        </a>
      </OverlayTrigger>
    </g>
  );
};
