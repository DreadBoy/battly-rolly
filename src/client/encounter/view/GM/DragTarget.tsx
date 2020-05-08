import React, {FC} from 'react';
import {DragSourceMonitor, useDrag} from 'react-dnd';
import {Feature} from '../../../../server/model/feature';
import {createUseStyles} from 'react-jss';
import {TargetType} from './DropTarget';

type Props = {
    onDrop: (setup: TargetType) => void,
}

const useStyles = createUseStyles({
    item: {
        cursor: 'pointer',
    },
});

export const DragTarget: FC<Props> = ({children, onDrop}) => {
    const [, drag] = useDrag({
        item: {type: 'feature'},
        end: (item: Feature | undefined, monitor: DragSourceMonitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult)
                onDrop(dropResult.type);
        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const classes = useStyles();


    return (
        <div ref={drag} className={classes.item}>{children}</div>
    );
};
