import React from 'react';
import { Dom } from 'react-three-fiber';

export default props => {
  return (
    <Dom center>
      <div style={{ 
        display:'block', 
        position:'relative', 
        margin:'0 auto', 
        textAlign:'center',
        width:'100%', 
        height:'100%', 
        color:'ff0000', 
        background:'black' 
      }}
      >
        loading ...
      </div>
    </Dom>
  );
}
