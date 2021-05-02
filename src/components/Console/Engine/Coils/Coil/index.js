import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame, useLoader } from 'react-three-fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default ({gltf, visible=true, ...props}) => {
  const {scene:{children:[{geometry, name}]}} = useLoader(GLTFLoader, gltf);
  return (
    <mesh key={name} visible={visible} {...props}>
      <bufferGeometry attach="geometry" {...geometry} />
      <meshPhongMaterial attach="material" depthTest={true} depthWrite={true} side={THREE.FrontSide} color={0x666666} reflectivity={0} flatShading={false} roughness={0.8} metalness={0.2} emissive={0x101010} specular={0x101010} shininess={100} /> 
    </mesh>
  );
}
