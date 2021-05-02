import React, { useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { ButtonGroup } from 'react-bootstrap';
import Close from './Close';
import Minimize from './Minimize';

export default ({ hud, title = '', ...props }) => {
  const { position, setPosition, dimensions, setDimensions, visible, setVisible, maximized, setMaximized } = hud;
  const hudRef = useRef();

  useEffect(() => {
    if (!hudRef.current) return;
    const [left, top] = position;
    if (visible) {
      hudRef.current.style.left = `${left}px`;
      hudRef.current.style.top = `${top}px`;
    } else {
      const { width, height, left, top } = hudRef.current.getBoundingClientRect();
      setDimensions([width, height]);
      setPosition([left, top]);
    }
  }, [visible]);

  useEffect(() => {
    if (!hudRef.current) return;
    const [width, height] = dimensions;
    if (maximized) {
      hudRef.current.style.width = width;
      hudRef.current.style.height = height;
    } else {
      const { width, height, left, top } = hudRef.current.getBoundingClientRect();
      setDimensions([width, height]);
      setPosition([left, top]);
      hudRef.current.style.height = '60px';
    }
  }, [maximized]);

  return (
    <Draggable handle=".card-header" onStop={({}, data) => setPosition([position[0] + data.deltaX, position[1] + data.deltaY])}>
      <div
        className="card variant-light hud"
        ref={hudRef}
        style={{
          resize: maximized ? 'both' : 'none',
          width: `${dimensions[0]}px`,
          height: `${dimensions[1]}px`,
        }}
        {...props}
      >
        <div className="card-header" style={{ cursor: 'move' }}>
          <div className="row d-flex flex-row h-100 align-items-center">
            <div className="col card-title" style={{ margin: '0px', padding: '0px 5px' }}>
              {title}
            </div>
            <div className="col">
              <ButtonGroup className="float-right">
                {/**
                <Minimize
                  variant="primary"
                  active={!maximized}
                  onClick={() => setMaximized(!maximized)}
                  onTouchStart={() => setMaximized(!maximized)}
                />
                  **/}
                <Close onClick={() => setVisible(!visible)} onTouchStart={() => setVisible(!visible)} />
              </ButtonGroup>
            </div>
          </div>
        </div>
        <div className="card-body">{props.children}</div>
        <div className="card-footer"></div>
      </div>
    </Draggable>
  );
};
