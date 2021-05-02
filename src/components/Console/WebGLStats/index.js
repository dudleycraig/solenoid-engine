import {useEffect, useState} from 'react';
import { useFrame } from 'react-three-fiber';
import Stats from 'stats.js';

export default () => {
  const [stats] = useState(()=>new Stats({style:{'right':'0px'}}));
  useEffect(()=>{
    stats.showPanel(0); // 0:fps, 1:ms, 2:mb, 3+:custom
    stats.dom.style.position = 'absolute';
    stats.dom.style.left = 'auto';
    stats.dom.style.right = '2px';
    stats.dom.style.top = '5px';
    document.body.appendChild(stats.dom);
    return () => document.body.removeChild(stats.dom);
  }, []);

  return useFrame(state=>{
    stats.begin();
    state.gl.render(state.scene, state.camera);
    stats.end();
  }, 1);
}
