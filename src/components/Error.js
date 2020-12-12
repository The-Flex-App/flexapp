import React from 'react';
import { useLocation } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

export default function Error() {
  const { state } = useLocation();
  return (
    <Typography color={'secondary'}>
      <strong>Error:</strong> {state ? state.error : 'Unknown.'}
    </Typography>
  );
}
