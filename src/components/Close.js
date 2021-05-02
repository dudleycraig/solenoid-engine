import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default (props) => (
  <Button {...props} className="float-right" variant="primary" size="sm">
    <FontAwesomeIcon icon={faTimes} color={'rgba(255,255,255,0.8)'} />
  </Button>
);
