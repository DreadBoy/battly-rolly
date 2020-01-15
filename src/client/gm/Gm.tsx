import {createUseStyles} from 'react-jss';
import React, {FC} from 'react';

const useStyles = createUseStyles({
    gm: {},
});

export const Gm: FC = () => {
  const classes = useStyles();
  return (
    <div>GM</div>
  );
};
