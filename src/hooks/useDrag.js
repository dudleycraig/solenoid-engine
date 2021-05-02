import React, { useEffect, useReducer } from 'react';

export default (domElement) => {
  const [state, dispatch] = useReducer(
    (state, event) => {
      switch (event.type) {
        case 'touchstart':
        case 'mousedown':
          return !state.dragging
            ? {
                dragging: true,
                start: { x: event.pageX, y: event.pageY },
                prev: {},
                current: {},
                end: {},
              }
            : state;
        case 'touchmove':
        case 'mousemove':
          return state.dragging
            ? {
                dragging: true,
                start: { ...state.start },
                prev: { ...state.current },
                current: { x: event.pageX, y: event.pageY },
                end: { ...state.end },
              }
            : state;
        case 'touchend':
        case 'touchcancel':
        case 'mouseup':
        case 'mouseleave':
          return state.dragging
            ? {
                dragging: false,
                start: { ...state.start },
                current: { ...state.current },
                end: { x: event.pageX, y: event.pageY },
              }
            : state;
        default:
          return state;
      }
    },
    { dragging: false, start: {}, prev: {}, current: {}, end: {} }
  );

  useEffect(() => {
    if ('ontouchstart' in domElement) {
      domElement.addEventListener('touchstart', dispatch);
      domElement.addEventListener('touchmove', dispatch);
      domElement.addEventListener('touchend', dispatch);
      domElement.addEventListener('touchcancel', dispatch);
    } else {
      domElement.addEventListener('mousedown', dispatch);
      domElement.addEventListener('mousemove', dispatch);
      domElement.addEventListener('mouseup', dispatch);
      domElement.addEventListener('mouseleave', dispatch);
    }
    domElement.addEventListener('dragstart', () => false);

    return () => {
      if ('ontouchstart' in domElement) {
        domElement.removeEventListener('touchstart', dispatch);
        domElement.removeEventListener('touchmove', dispatch);
        domElement.removeEventListener('touchend', dispatch);
        domElement.removeEventListener('touchcancel', dispatch);
      } else {
        domElement.removeEventListener('mousedown', dispatch);
        domElement.removeEventListener('mousemove', dispatch);
        domElement.removeEventListener('mouseup', dispatch);
        domElement.removeEventListener('mouseleave', dispatch);
      }
      domElement.removeEventListener('dragstart', () => false);
    };
  }, []);

  return state;
};

/**
 * usage
 *
const drag = useDrag(domElement);
const ratio = 300;
const quadrants = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI];
const angleOfLine = (width, height) => {
  const signed = Math.atan2(height, width);
  return signed < 0 ? signed + 2 * Math.PI : signed;
};

useFrame(() => {
  if (engineRef.current && drag.prev && drag.prev.x) {
    const width = drag.current.x - drag.prev.x;
    const height = drag.current.y - drag.prev.y;
    const radians = angleOfLine(width, height);

    if (radians >= quadrants[0] && radians < quadrants[1]) {
      engineRef.current.rotation.x -= Math.abs(height) / ratio;
      engineRef.current.rotation.y += Math.abs(width) / ratio;
    }

    if (radians >= quadrants[1] && radians < quadrants[2]) {
      engineRef.current.rotation.x -= Math.abs(height) / ratio;
      engineRef.current.rotation.y -= Math.abs(width) / ratio;
    }

    if (radians >= quadrants[2] && radians < quadrants[3]) {
      engineRef.current.rotation.x += Math.abs(height) / ratio;
      engineRef.current.rotation.y -= Math.abs(width) / ratio;
    }

    if (radians >= quadrants[3] && radians < quadrants[4]) {
      engineRef.current.rotation.x += Math.abs(height) / ratio;
      engineRef.current.rotation.y += Math.abs(width) / ratio;
    }
  }
});
 *
 **/
