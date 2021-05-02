import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from 'react-three-fiber';

export default (props) => {
  const ref = useRef();
  const { setDefaultCamera } = useThree();
  useEffect(()=>void setDefaultCamera(ref.current), []); // make camera known to system
  useFrame(()=>ref.current.updateMatrixWorld()); // update every frame
  return <perspectiveCamera ref={ref} {...props} />
}
