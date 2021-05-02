import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowMinimize, faWindowMaximize } from '@fortawesome/free-solid-svg-icons';

export default ({ active = false, ...props }) => (
  <Button {...props} size="sm">
    <FontAwesomeIcon icon={active ? faWindowMaximize : faWindowMinimize} color={'rgba(255,255,255,0.8)'} />
  </Button>
);
