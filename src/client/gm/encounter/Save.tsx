import React, {FC} from 'react';
import {abilityShort, isSave, Save as DnDSave} from '../../common/encounter';
import {useDrag} from './use-drag';
import {nameToDisplay, rollToDisplay} from './Attack';

type Props = {
    action: DnDSave,
    onAttack: (playerId: string, action: DnDSave) => void,
}

export const Save: FC<Props> = ({action, onAttack}) => {
    const drag = useDrag(action, onAttack);

    return (
        <div ref={drag} className={'extra content'}>
            {isSave(action) ? (
                <span>
                        {nameToDisplay(action.name)}: {action.DC} {abilityShort(action.ability)} <b>
                    {action.damageSuccess?.rolls.map(rollToDisplay)}/{action.damageFailure?.rolls.map(rollToDisplay)}
                        </b> {action.damageFailure?.damageType}
                    </span>
            ) : null}

        </div>

    );
};
