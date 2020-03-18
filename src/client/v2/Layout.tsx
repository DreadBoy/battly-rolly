import React, {FC, ReactNode} from 'react';
import {Container, Icon, Menu} from 'semantic-ui-react';
import {createUseStyles} from 'react-jss';
import icon from '../../assets/dice-twenty-faces-twenty.svg';
import {Link} from 'react-router-dom';
import {usePlayerId} from './helpers/PlayerId';

const useStyles = createUseStyles({
    grid: {
        height: '100vh',
        width: '100vw',
    },
});

export const Layout: FC<{ title: ReactNode }> = ({title, children}) => {
    const classes = useStyles();
    const {id} = usePlayerId();
    return (
        <div className={classes.grid}>
            <Menu>
                <Container>
                    <Link to={'/v2'} className={'header item'}>
                        <img src={icon} alt={'icon'}/>
                    </Link>
                    {title && <Menu.Item header>{title}</Menu.Item>}
                    <Menu.Item position={'right'}>
                        {/*TODO Use some logic to create this link*/}
                        <Link to={`/v2/user/${id}/edit`}>
                            <Icon name='user outline'/>
                        </Link>
                    </Menu.Item>
                </Container>
            </Menu>
            <Container>
                {children}
            </Container>
        </div>
    );
};
