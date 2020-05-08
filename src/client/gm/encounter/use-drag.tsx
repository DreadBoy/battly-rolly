import {BaseAction} from '../../../server/encounter';
import {DragSourceMonitor, useDrag as _useDrag} from 'react-dnd';

export function useDrag<T extends BaseAction = BaseAction>(action: T, onAttack: (playerId: string, action: T) => void) {
    const [, drag] = _useDrag({
        item: {action, type: 'monster'},
        end: (item: { action: T, type: 'monster' } | undefined, monitor: DragSourceMonitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult)
                onAttack(dropResult.playerId, item.action);
        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });
    return drag;
}
