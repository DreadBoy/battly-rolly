import React, {FC} from 'react';
import {useRouteMatch} from 'react-router';

type Props = {
    path: string,
    component: FC,
}

export const RouteUnder: FC<Props> = ({component, path}) => {
    const {path: matchPath} = useRouteMatch();
    return matchPath.endsWith(path) ? React.createElement(component) : null;
};
