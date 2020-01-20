import {createUseStyles} from 'react-jss';
import React, {FC} from 'react';
import {Segment} from 'semantic-ui-react';

type Props = {
    bg: string,
    position?: string,
    centered?: boolean,
}

const useStyles = createUseStyles({
    grid: {
        height: '100vh',
        width: '100vw',
        display: 'grid',
        alignItems: 'center',
    },
    image: {
        background: ({bg, position}: Props) => `url(${bg}) ${position} / cover`,
        gridColumn: '1 / 1',
        gridRow: '1 / 1',
        justifySelf: 'stretch',
        alignSelf: 'stretch',
    },
    panel: {
        gridColumn: '1 / 1',
        gridRow: '1 / 1',
        zIndex: 1,
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: ({centered}: Props) => centered ? 'center' : 'stretch',
        padding: 20,
        '&.ui.segment': {margin: 10},
    },
});

export const Splash: FC<Props> = ({bg, position, centered, children}) => {
    const classes = useStyles({bg, position, centered});
    return (
        <div className={classes.grid}>
            <div className={classes.image}/>
            <Segment raised className={classes.panel}>
                {children}
            </Segment>
        </div>
    );
};
Splash.defaultProps = {
    position: 'center center',
    centered: false,
};
