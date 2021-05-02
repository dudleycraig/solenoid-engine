import React from 'react';
import Engine from './Engine';
import Hud from './Hud';

export default () => {
  return (
    <>
      <Engine />
      <Hud id="hud" />
    </>
  );
};
