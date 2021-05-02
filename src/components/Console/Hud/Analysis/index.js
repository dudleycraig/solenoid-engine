import React from 'react';
import Hud from '../../../Hud';
import Sinusoidal from './Sinusoidal';
import { Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import useStore from '../../../../store';

export default (props) => {
  const hud = useStore((state) => state.hud.analysis);
  return (
    <Hud id="analysis" hud={hud}>
      <div className="row">
        <div className="col col-xl-9">
          <Sinusoidal />
        </div>
        <div className="col-xl-3">
          <ButtonGroup vertical size="sm">
            <Button className="small" active={true}>
              Crankshaft
            </Button>
            <Button className="small">Coil #1</Button>
            <Button className="small">Coil #2</Button>
            <Button className="small">Coil #3</Button>
            <Button className="small">Coil #4</Button>
            <Button className="small">Coil #5</Button>
            <Button className="small">Coil #6</Button>
          </ButtonGroup>
        </div>
      </div>
    </Hud>
  );
};
