import React from 'react';
import * as THREE from 'three';
import { useThree } from 'react-three-fiber';

export default () => {
  const path = process.env.REACT_APP_HTTP_PATH;
  const http = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_HTTP_HOST}:${process.env.REACT_APP_HTTP_PORT}${path}`;
  const assets = `${process.env.REACT_APP_ASSETS_PROTOCOL}://${process.env.REACT_APP_ASSETS_HOST}:${process.env.REACT_APP_ASSETS_PORT}`;
  const engine = `${process.env.REACT_APP_ENGINE_PROTOCOL}://${process.env.REACT_APP_ENGINE_HOST}:${process.env.REACT_APP_ENGINE_PORT}`;

  const { scene } = useThree();
  scene.background = new THREE.Color(0x002b36);
  const texture = new THREE.CubeTextureLoader()
    .setPath(`${assets}/images/skybox/`)
    .load([
      'skybox-grid.transparent.1024x1024-sides.png',
      'skybox-grid.transparent.1024x1024-sides.png',
      'skybox-grid.transparent.1024x1024-sides.png',
      'skybox-grid.transparent.1024x1024-sides.png',
      'skybox-grid.transparent.1024x1024-sides.png',
      'skybox-grid.transparent.1024x1024-sides.png',
    ]);
  texture.encoding = THREE.sRGBEncoding;
  return (
    <mesh>
      <boxBufferGeometry args={[1024, 1024, 1024]} attach={'geometry'} />
      <meshPhongMaterial attach={'material'} envMap={texture} side={THREE.BackSide} color={0x002b36} transparent={true} opacity={0.8} />
    </mesh>
  );
};
