import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamation, faCheck } from '@fortawesome/free-solid-svg-icons';

export default ({ src, cached = false, ...props }) => {
  const statusMap = {
    'no-image': { status: 'warning', icon: faSpinner, spin: false },
    loading: { status: 'warning', icon: faSpinner, spin: true },
    'has-image': { status: 'success', icon: faCheck, spin: false },
    error: { status: 'error', icon: faExclamation, spin: false },
  };
  const domRef = useRef();
  const [status, setStatus] = useState('no-image');

  const fetchItemImage = async (dom, src) => {
    try {
      setStatus('loading');
      const response = await fetch(src, { method: 'GET', cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP error retrieving ${src}, code: ${response.status}.`);
      const blob = await response.blob();
      dom.setAttribute('src', URL.createObjectURL(blob));
    } catch (error) {
      console.log(error);
      setStatus('error');
    }
  };

  useEffect(() => {
    const imageLoadHandler = () => (URL.revokeObjectURL(domRef.current.src), setStatus('has-image'));
    const imageErrorHandler = () => (URL.revokeObjectURL(domRef.current.src), setStatus('error'));
    domRef.current.addEventListener('load', imageLoadHandler);
    domRef.current.addEventListener('error', imageErrorHandler);
    cached ? domRef.current.setAttribute('src', src) : fetchItemImage(domRef.current, src);
    return () => {
      domRef.current.removeEventListener('load', imageLoadHandler);
      domRef.current.removeEventListener('error', imageErrorHandler);
    };
  }, []);

  return (
    <>
      <img ref={domRef} style={{ ...(props.style ? props.style : {}), display: status === 'has-image' ? 'inline' : 'none' }} {...props} />
      <FontAwesomeIcon
        className={`${statusMap[status].status} mt-4`}
        style={{ display: status !== 'has-image' ? 'inline' : 'none' }}
        icon={statusMap[status].icon}
        spin={statusMap[status].spin}
        size="2x"
      />
    </>
  );
};
