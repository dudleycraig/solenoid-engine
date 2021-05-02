import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSyncAlt,
  faExclamation,
  faPlay,
  faStop,
  faPause,
  faCheck,
  faQuestion,
} from '@fortawesome/free-solid-svg-icons';

export default ({
  status,
  statusMap = {
    inert: { icon: faPlay, color: 'auto' },
    closed: { icon: faPlay, color: 'auto' },
    connecting: { icon: faSyncAlt, color: 'orange' },
    closing: { icon: faSyncAlt, color: 'orange' },
    sending: { icon: faSyncAlt, color: 'orange' },
    receiving: { icon: faSyncAlt, color: 'orange' },
    active: { icon: faStop, color: 'auto' },
    connected: { icon: faStop, color: 'auto' },
    open: { icon: faStop, color: 'auto' },
    success: { icon: faCheck, color: 'green' },
    warning: { icon: faExclamation, color: 'orange' },
    error: { icon: faExclamation, color: 'red' },
  },
  ...props
}) => {
  const awaiting = ['connecting', 'closing', 'sending', 'receiving'];
  return (
    <FontAwesomeIcon
      className={`${awaiting.includes(status) && 'fa-spin'}`}
      icon={statusMap[status].icon}
      color={statusMap[status].color}
      disabled={awaiting.includes(status)}
      {...props}
    />
  );
};
