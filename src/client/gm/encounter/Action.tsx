import React, {FC} from 'react';
import {Action as DnDAction, isAttack, Roll} from '../../common/encounter';
import {DragSourceMonitor, useDrag} from 'react-dnd';

type Props = {
    action: DnDAction,
    onAttack: (playerId: string, action: DnDAction) => void,
}

export const Action: FC<Props> = ({action, onAttack}) => {
    const [, drag] = useDrag({
        item: {action, type: 'monster'},
        end: (item: { action: DnDAction, type: 'monster' } | undefined, monitor: DragSourceMonitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult)
                onAttack(dropResult.playerId, item.action);
        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });
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
    return name.split('_').map(part => part).join(' ');
}

export function rollToDisplay(roll: Roll) {
    return `(${roll[0]}d${roll[1]}+${roll[2]})`
}
