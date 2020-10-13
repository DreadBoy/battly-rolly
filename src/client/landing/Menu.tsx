import React, {FC} from 'react';
import {Button, Container, Menu as SMenu} from 'semantic-ui-react';
import {useRouteMatch} from 'react-router';
import {Link} from 'react-router-dom';
import {createUseStyles} from 'react-jss';
import classNames from 'classnames';
import {app} from '../App';
import {UpdateButton} from '../layout/UpdateButton';

type Props = {
    className?: string,
    onLanding?: boolean,
}

const useStyles = createUseStyles({
    menuOnLanding: {
        '&.ui.menu': {
            background: 'transparent',
            boxShadow: 'none',
            border: '1px solid transparent',

        },
        '&.ui.menu .item, &.ui.menu .item:hover': {
            color: 'white',
            textShadow: '2px 2px 4px #000000',
        },
        '&.ui.menu .item:before': {
            display: 'none',
        },
    },
    buttonOnLanding: {
        '&.ui.basic.button': {
            textShadow: '2px 2px 4px rgba(255, 255, 255, 0.5) !important',
            boxShadow: '0 0 0 1px #2185d0 inset, 0 0 4px 0 rgba(255, 255, 255, 0.5) !important',
        },
    },
});

export const Menu: FC<Props> = ({className, onLanding}) => {
    const {path} = useRouteMatch();
    const classes = useStyles({onLanding});
    return (
        <>
            <Container>
                <SMenu
                    className={classNames(className, {[classes.menuOnLanding]: onLanding})}
                    size={'large'}
                >
                    <SMenu.Item as={Link} to={'/'} active={path === '/'}>Home</SMenu.Item>
                    <SMenu.Item as={Link} to={'/about'} active={path === '/about'}>About</SMenu.Item>
                    <SMenu.Item position={'right'}>
                        <Button
                            primary
                            basic
                            className={classNames({[classes.buttonOnLanding]: onLanding})}
                            as={Link}
                            to={app()}
                        >
                            Log in
                        </Button>
                    </SMenu.Item>
                </SMenu>
            </Container>
            <UpdateButton/>
        </>
    );
}
Menu.defaultProps = {
    onLanding: false,
}
