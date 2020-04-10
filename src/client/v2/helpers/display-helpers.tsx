import React from 'react';
import {Icon} from 'semantic-ui-react';
import {Feature} from '../../../server/model/feature';
import {Ability} from '../../common/encounter';
import {isNil} from 'lodash';

export function featureToDisplay(feature?: Feature) {
    if (isNil(feature))
        return undefined;
    return feature.type === 'npc' ? feature.reference : `User: ${feature.reference}`
}

export function abilityShort(ability: Ability) {
    return ability.slice(0, 3).toUpperCase();
}

export function success(success?: boolean) {
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
