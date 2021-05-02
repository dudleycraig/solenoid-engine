import React, { useState, useEffect } from 'react';

import useStore from '../../../../store';
import Coil from './Coil';
import Annotation from '../../Annotation';

export default (props) => {
  const path = process.env.REACT_APP_HTTP_PATH;
  const http = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_HTTP_HOST}:${process.env.REACT_APP_HTTP_PORT}${path}`;
  const assets = `${process.env.REACT_APP_ASSETS_PROTOCOL}://${process.env.REACT_APP_ASSETS_HOST}:${process.env.REACT_APP_ASSETS_PORT}`;
  const engine = `${process.env.REACT_APP_ENGINE_PROTOCOL}://${process.env.REACT_APP_ENGINE_HOST}:${process.env.REACT_APP_ENGINE_PORT}`;
  const models = useStore((state) => state.coils.models);

  return [
    Object.keys(models).map((name) => {
      const { position: modelPosition, rotation: modelRotation, annotation = {}, modelVisible = true, ...modelProps } = models[name];
      const { text, position: annotationPosition, ...annotationProps } = annotation || {};
      const [annotationX, annotationY, annotationZ] = annotationPosition || [];
      const [modelX, modelY, modelZ] = modelPosition;

      return (
        <group key={`coil-${name}`}>
          <Coil position={modelPosition} rotation={modelRotation} visible={modelVisible} gltf={`${assets}/models/coil.gltf`} {...modelProps} />
          {models[name].annotation && (
            <Annotation
              key={`annotation-${name}`}
              annotationPosition={[annotationX, annotationY, annotationZ]}
              subjectRelativePosition={[modelX, annotationY, annotationZ]}
              {...annotationProps}
            >
              {text}
            </Annotation>
          )}
        </group>
      );
    }),
  ];
};
