import React, {FC, useCallback, useState} from 'react';
import {Action as DnDAction} from '../../common/encounter';
import {DragSourceMonitor, useDrag} from 'react-dnd';
import {Modal} from './ManualAttackModal';

type Props = {
    onAttack: (playerId: string, action: DnDAction) => void,
}

export const ManualAttack: FC<Props> = ({onAttack}) => {
    const [modal, setModal] = useState<string>('');
    const [, drag] = useDrag({
        item: {type: 'monster'},
        end: (item: { type: 'monster' } | undefined, monitor: DragSourceMonitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult)
                setModal(dropResult.playerId);
        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const onConfirm = useCallback((action: DnDAction) => {
        onAttack(modal, action);
    }, [modal, onAttack]);
    const onCancel = useCallback(() => {
        setModal('');
    }, []);

    if (modal.length > 0)
        return (
            <Modal onConfirm={onConfirm} onCancel={onCancel}/>
        );
    return (
        <div ref={drag} className={'extra content'}>
            <span>
                manual attack
            </span>

        </div>

    );
};
