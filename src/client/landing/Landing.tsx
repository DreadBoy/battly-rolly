import React, {FC} from 'react';
import {Button, Container, Header, Icon} from 'semantic-ui-react';
import {createUseStyles} from 'react-jss';
import bg from '../../assets/backgrounds/clint-bustrillos-X-A-LJVAhzk-unsplash.jpg';
import {Link} from 'react-router-dom';
import {app} from '../App';
import {Menu} from './Menu';

const height = 100;

const useStyles = createUseStyles({
    grid: {
        height: `${height}vh`,
        width: '100vw',
        display: 'grid',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        overflow: 'hidden',
    },
    banner: {
        gridColumn: '1 / 1',
        gridRow: '1 / 1',
        background: `url(${bg}) center 60% / cover`,
        filter: 'blur(5px)',
        paddingTop: '0.1px',
        transform: 'scale(1.1)',
    },
    content: {
        gridColumn: '1 / 1',
        gridRow: '1 / 1',
        zIndex: 1,
        paddingTop: `calc(${height / 2}vh - 7.2em)`,
    },
    header1: {
        '&.ui.header': {
            fontSize: '4em',
            fontWeight: 'normal',
            marginBottom: 0,
            // marginTop: `${15 / 80 * height}vh`,
            color: 'white',
            textShadow: '2px 2px 6px #000000',
        },
    },
    header2: {
        '&.ui.header': {
            fontSize: '1.7em',
            fontWeight: 'normal',
            marginBottom: '1em',
            marginTop: '1.5em',
            color: 'white',
            textShadow: '2px 2px 6px #000000',
        },
    },
    button: {
        '&.ui.primary.button': {
            boxShadow: '1px 1px 6px #000000',
        },
    },
    menu: {
        gridColumn: '1 / 1',
        gridRow: '1 / 1',
        alignSelf: 'start',
        zIndex: 2,
    },
})

export const Landing: FC = () => {
    const classes = useStyles();
    return (
        <div className={classes.grid}>
            <div className={classes.menu}>
                <Menu onLanding={true}/>
            </div>
            <div className={classes.banner}/>
            <Container text className={classes.content}>
                <Header
                    as='h1'
                    content='Crit Hit'
                    className={classes.header1}
                />
                <Header
                    as='h2'
                    content='Run encounters with ease. Roleplay instead of crunching numbers!'
                    className={classes.header2}
                />
                <Button size={'huge'} primary className={classes.button} as={Link} to={app()}>
                    Get Started
                    <Icon name='arrow right'/>
                </Button>
            </Container>
        </div>
    );
}
