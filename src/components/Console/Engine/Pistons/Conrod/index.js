import React, { forwardRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from 'react-three-fiber';

export default forwardRef(({ visible = true, ...props }, ref) => {
  const path = process.env.REACT_APP_HTTP_PATH;
  const http = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_HTTP_HOST}:${process.env.REACT_APP_HTTP_PORT}${path}`;
  const assets = `${process.env.REACT_APP_ASSETS_PROTOCOL}://${process.env.REACT_APP_ASSETS_HOST}:${process.env.REACT_APP_ASSETS_PORT}`;
  const engine = `${process.env.REACT_APP_ENGINE_PROTOCOL}://${process.env.REACT_APP_ENGINE_HOST}:${process.env.REACT_APP_ENGINE_PORT}`;
  const {
    scene: {
      children: [{ geometry }],
    },
  } = useLoader(GLTFLoader, `${assets}/models/conrod.gltf`);

  return (
    <mesh ref={ref} visible={visible} {...props}>
      <bufferGeometry attach="geometry" {...geometry} />
      <meshPhongMaterial
        attach="material"
        depthTest={true}
        depthWrite={true}
        side={THREE.FrontSide}
        color={0xff3300}
        reflectivity={0}
        flatShading={false}
        roughness={0.8}
        metalness={0.2}
        emissive={0x101010}
        specular={0x101010}
        shininess={100}
      />
    </mesh>
  );
});
