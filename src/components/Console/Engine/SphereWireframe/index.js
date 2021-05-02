import React, {useRef, useEffect} from 'react';
import { Canvas, useThree, useFrame } from 'react-three-fiber';
import * as THREE from 'three';

export default ({bouncingSpeed='0.02', ...props}) => {
  const sphere = useRef();
  let step = 0;
  useFrame(state=>{
    step += parseFloat(bouncingSpeed);
    sphere.current.position.x = 20 + 10*(Math.cos(step))
    sphere.current.position.y = 2 + 10*(Math.abs(Math.sin(step)))
  });
  return (
    <mesh 
      ref={sphere}
      {...props} 
    >
      <sphereGeometry 
        attach={'geometry'} 
        args={[4,20,20]} 
      />
      <meshLambertMaterial 
        attach={'material'} 
        color={0x7777FF} 
      />
      <arrowHelper />
    </mesh>
  );
}
