import React, {ButtonHTMLAttributes, DetailedHTMLProps, FC} from 'react';
import {createUseStyles} from 'react-jss';

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const useStyles = createUseStyles({
    button: {
        display: 'inline',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        margin: 0,
        padding: 0,
        color: '#4183c4',
        textDecoration: 'none',
        outline: 'none',

        '&:hover, &:focus': {
            textDecoration: 'none',
            outline: 'none',
        },
    },
});

export const ButtonAsLink: FC<Props> = (props) => {
    const classes = useStyles();
    return (
        <button type={'button'} {...props} className={classes.button}/>
    );
}
