import {Styles} from 'react-jss';

export const column: Styles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
};

export const fullColumn: Styles = {
    ...column,
    height: '100vh',
    padding: '0 20px',
};
