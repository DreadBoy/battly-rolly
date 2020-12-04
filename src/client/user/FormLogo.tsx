import React, {FC} from 'react';
import {Link} from 'react-router-dom';
import {Header} from 'semantic-ui-react';
import icon from '../../assets/dice-twenty-faces-twenty.svg';
import {createUseStyles} from 'react-jss';

const useStyles = createUseStyles({
    link: {
        display: 'block',
    },
});
export const FormLogo: FC = ({children}) => {
    const classes = useStyles();
    return (
        <>
            <Link to={'/'} className={classes.link}>
                <Header as={'h1'} textAlign={'center'}>
                    <img src={icon} alt={'icon'}/>
                    <Header.Content>Crit Hit</Header.Content>
                </Header>
            </Link>
            <Header as={'h2'} textAlign={'center'}>{children}</Header>
        </>
    );
};
