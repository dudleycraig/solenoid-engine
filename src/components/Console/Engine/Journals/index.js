import React from 'react';
import { useLoader } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import useStore from '../../../../store';

export default (props) => {
  const path = process.env.REACT_APP_HTTP_PATH;
  const http = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_HTTP_HOST}:${process.env.REACT_APP_HTTP_PORT}${path}`;
  const assets = `${process.env.REACT_APP_ASSETS_PROTOCOL}://${process.env.REACT_APP_ASSETS_HOST}:${process.env.REACT_APP_ASSETS_PORT}`;
  const engine = `${process.env.REACT_APP_ENGINE_PROTOCOL}://${process.env.REACT_APP_ENGINE_HOST}:${process.env.REACT_APP_ENGINE_PORT}`;
  const {
    scene: { children },
  } = useLoader(GLTFLoader, `${assets}/models/journals.gltf`);
  const models = useStore((state) => state.journals.models);

  return (
    <>
      {children.map((child) => {
        const { geometry, name } = child;
        const { visible } = models[name];

        return (
          <mesh key={`model-${name}`} visible={visible}>
            <bufferGeometry attach="geometry" {...geometry} />
            <meshPhongMaterial
              attach="material"
              depthTest={true}
              depthWrite={true}
              side={THREE.FrontSide}
              color={0x666666}
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
      })}
    </>
  );
};
