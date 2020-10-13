import React, {FC} from 'react';
import {Menu} from '../landing/Menu';

export const Page: FC = ({children}) => (
    <>
        <Menu/>
        {children}
    </>
)
