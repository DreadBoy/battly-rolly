import React, {createElement, Fragment, ReactElement} from 'react';
import {Icon} from 'semantic-ui-react';
import {Feature} from '../../server/model/feature';
import {Ability} from '../../server/encounter';
import {isNil, map} from 'lodash';
import { type } from '../../server/model/helpers';

export function featureToDisplay(feature?: Feature): string {
    if (isNil(feature))
        return '';
    if (type(feature) === 'player')
        return feature.player?.displayName ?? '';
    return feature.monster?.name ?? '';
}

export function abilityShort(ability: Ability) {
    return ability.slice(0, 3).toUpperCase();
}

export function success(success: boolean | null) {
    return success === true ? (
        <Icon name='check' color='green'/>
    ) : success === false ? (
        <Icon name='close' color='red'/>
    ) : (
        <Icon name='spinner' color='blue' loading/>
    );
}

export function possessive(str?: string) {
    if (isNil(str))
        return undefined;
    return `${str}'${str.endsWith('s') ? '' : 's'}`;
}

export function multiline<T>(array: T[], mapper: (item: T, index: number) => ReactElement | null | string | undefined) {
    const _mapper = (item: T, index: number) => {
        const i = mapper(item, index);
        if (isNil(i))
            return null;
        if (typeof i === 'string')
            return <>{i}</>;
        return i;
    }
    return createElement(
        Fragment,
        null,
        ...map(array, (item, index) =>
            (
                <>
                    {index > 0 && <br/>}
                    {_mapper(item, index)}
                </>
            )),
    );
}
