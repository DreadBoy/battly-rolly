import React, {FC} from 'react';
import {Attack as DnDAttack, isAttack, Roll} from '../../../server/encounter';
import {useDrag} from './use-drag';

type Props = {
    action: DnDAttack,
    onAttack: (playerId: string, action: DnDAttack) => void,
}

export const Attack: FC<Props> = ({action, onAttack}) => {
    const drag = useDrag(action, onAttack);

    return (
        <div ref={drag} className={'extra content'}>
            {isAttack(action) ? (
                <span>
                        {nameToDisplay(action.name)}: <b>{action.damage.rolls.map(rollToDisplay)}</b> {action.damage.damageType}
                    </span>
            ) : null}

        </div>

    );
};

export function nameToDisplay(name: string) {
    return name;
}

export function rollToDisplay(roll: Roll) {
    return `(${roll[0]}d${roll[1]}+${roll[2]})`
}
