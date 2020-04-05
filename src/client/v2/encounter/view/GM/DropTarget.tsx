import React, {FC, useCallback} from 'react';
import {useDrop} from 'react-dnd';
import {Feature} from '../../../../../server/model/feature';
import {List} from 'semantic-ui-react';

export type TargetType = 'source' | 'target';

type Props = {
    type: TargetType,
    features: Feature[],
    onClear: (id: string) => void,
    canDrop: boolean,
}

export const DropTarget: FC<Props> = ({type, features, onClear, canDrop}) => {
    const [{canDrop: _canDrop}, drop] = useDrop({
        accept: 'feature',
        drop: () => ({type}),
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop() && canDrop,
        }),
    });

    const _onClear = useCallback((id: string) => () => {
        onClear(id);
    }, [onClear]);

    return (
        <div className={`ui segment${_canDrop ? ' raised' : ''}`} ref={drop}>
            <List>
                {features.length > 0 ?
                    features
                        .map((f) => (
                            <List.Item key={f.id}>
                                <List.Icon
                                    link
                                    name='close'
                                    onClick={_onClear(f.id)}
                                />
                                <List.Content>{
                                    f.type === 'npc' ? f.reference : `User: ${f.reference}`
                                }
                                </List.Content>
                            </List.Item>
                        )) : (
                        <List.Item>
                            <List.Content>&nbsp;</List.Content>
                        </List.Item>
                    )}
            </List>

        </div>
    );
};
