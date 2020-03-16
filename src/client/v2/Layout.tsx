import React, {FC} from 'react';
import {Container, Icon, Menu} from 'semantic-ui-react';
import {createUseStyles} from 'react-jss';
import icon from '../../assets/dice-twenty-faces-twenty.svg';

const useStyles = createUseStyles({
    grid: {
        height: '100vh',
        width: '100vw',
    },
});

export const Layout: FC<{ title?: string }> = ({title, children}) => {
    const classes = useStyles();
    return (
        <div className={classes.grid}>
            <Menu>
                <Menu.Item header>
                    <img src={icon} alt={'icon'}/>
                </Menu.Item>
                {title && <Menu.Item header>{title}</Menu.Item>}
                <Menu.Item position={'right'}>
                    <Icon name='user outline'/>
                </Menu.Item>
            </Menu>
            <Container>
                {children}
            </Container>
        </div>
    );
};
