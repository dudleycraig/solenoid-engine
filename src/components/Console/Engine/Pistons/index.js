import React from 'react';
import * as THREE from 'three';
import useStore from '../../../../store';
import Conrod from './Conrod';
import Plunger from './Plunger';

export default ({ sample, props }) => {
  const rodLength = 41.6;
  const crankRadius = 5.5;
  const models = useStore((state) => state.pistons.models);

  // get distance plunger and crank have travelled relative to crank position
  const getDisplacement = (offsetRotation) =>
    crankRadius * Math.cos(THREE.MathUtils.degToRad(parseFloat(sample.r)) + offsetRotation) +
    Math.sqrt(Math.pow(rodLength, 2) - Math.pow(crankRadius, 2) * Math.pow(Math.sin(sample.r + offsetRotation), 2));

  // get angle crank has moved relative to crank rotation
  const getMoment = (offsetRotation) =>
    Math.asin(crankRadius / (rodLength / Math.sin(THREE.MathUtils.degToRad(parseFloat(sample.r)) + offsetRotation))) *
    -1;

  return (
    <group>
      {Object.keys(models).map((name) => {
        const { position, offsetAngle, offsetRotation, visible } = models[name];
        const displacement = getDisplacement(offsetRotation);
        const moment = getMoment(offsetRotation);

        return (
          <group key={name} rotation={[0, 0, offsetAngle >= 180 ? Math.PI : 0]} position={position}>
            <Conrod displacement={displacement} moment={moment} visible={visible} />
            <Plunger displacement={displacement} visible={visible} />
          </group>
        );
      })}
    </group>
  );
};
