import {createUseStyles} from 'react-jss';
import React, {FC} from 'react';
import {Segment} from 'semantic-ui-react';
import bg from '../../assets/backgrounds/clint-bustrillos-X-A-LJVAhzk-unsplash.jpg';

const useStyles = createUseStyles({
    grid: {
        height: '100vh',
        width: '100vw',
        display: 'grid',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        background: `url(${bg}) center center / cover`,
        gridColumn: '1 / 1',
        gridRow: '1 / 1',
        justifySelf: 'stretch',
        alignSelf: 'stretch',
        filter: 'blur(3px)',
        transform: 'scale(1.05)'
    },
    panel: {
        gridColumn: '1 / 1',
        gridRow: '1 / 1',
        zIndex: 1,
        background: 'white',
        padding: 20,
        '&.ui.segment': {margin: 10},
    },
});

export const Splash: FC = ({children}) => {
    const classes = useStyles();
    return (
        <div className={classes.grid}>
            <div className={classes.image}/>
            <Segment raised className={classes.panel}>
                {children}
            </Segment>
        </div>
    );
};
