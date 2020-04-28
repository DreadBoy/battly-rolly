import React, {FC, useCallback} from 'react';
import {List} from 'semantic-ui-react';
import {Feature} from '../../../../../server/model/feature';
import {createUseStyles} from 'react-jss';
import {DragTarget} from './DragTarget';
import {OnDrop} from './MakeAttack';
import {TargetType} from './DropTarget';
import {roll} from '../../../../common/roll';
import {isAoe, isDirect, type} from '../../../../../server/model/helpers';
import {Action} from '../../../../../server/model/action';
import {featureToDisplay} from '../../../helpers/display-helpers';

type Props = {
    feature: Feature,
    onDrop: (setup: OnDrop) => void,
}

const useStyles = createUseStyles({
    list: {
        '.ui.list .list&': {
            padding: '.14285714em 0 .25em 1em',
        },
    },
});

export const FeatureItem: FC<Props> = ({feature, onDrop}) => {


    const monster = feature.monster;
    const classes = useStyles();

    const _onDrop = useCallback((action: Action | null) =>
        (target: TargetType) => {
            if (action === null && target === 'source')
                return alert('This entity can\'t attack since it doesn\'t have actions!');
            if (action === null || target === 'target')
                return onDrop({
                    target,
                    action: null,
                });
            if (isDirect(action))
                return onDrop({
                    target,
                    action: {
                        type: 'direct',
                        name: action.name,
                        attack: roll([1, 20, action.modifier]),
                    },
                });
            if (isAoe(action))
                return onDrop({
                    target,
                    action: {
                        type: 'aoe',
                        name: action.name,
                        stat: action.ability,
                        DC: action.DC,
                    },
                });
        }, [onDrop]);

    return (
        <List.Item>
            {type(feature) === 'player' ? (
                <DragTarget onDrop={_onDrop(null)}>{featureToDisplay(feature)}</DragTarget>
            ) : (
                <>
                    <DragTarget onDrop={_onDrop(null)}>{featureToDisplay(feature)}</DragTarget>
                    <List.List className={classes.list}>
                        {monster?.actions.map(action => (
                            <List.Item key={action.name}>
                                <DragTarget onDrop={_onDrop(action as Action)}>{action.name}</DragTarget>
                            </List.Item>
                        ))}
                    </List.List>
                </>
            )}
        </List.Item>
    );
};
