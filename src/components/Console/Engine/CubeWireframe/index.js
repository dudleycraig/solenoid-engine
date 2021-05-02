import React, {useRef, useEffect} from 'react';
import { Canvas, useThree, useFrame } from 'react-three-fiber';
import * as THREE from 'three';

export default ({rotationSpeed='0.02', ...props}) => {
  const cube = useRef();
  useFrame(state => {
    cube.current.rotation.x += parseFloat(rotationSpeed);
    cube.current.rotation.y += parseFloat(rotationSpeed);
    cube.current.rotation.z += parseFloat(rotationSpeed);
  });
  return (
    <mesh 
      ref={cube}
      {...props} 
    >
      <boxGeometry 
        attach={'geometry'} 
        args={[4,4,4]} 
      />
      <meshLambertMaterial 
        attach={'material'} 
        color={0xFF0000} 
      />
      <arrowHelper />
    </mesh>
  );
}
