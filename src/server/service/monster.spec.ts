import {afterEach as _afterEach, beforeEach as _beforeEach, seedMonsters, seedUsers} from '../test-helper/test-helpers'
import {getGm, getWizard, monsters} from '../test-helper/test-data';
import {broadcastObject} from './socket';
import {subscribe, updateMonster, unsubscribe} from './monster';
import {Monster} from '../model/monster';

jest.mock('./socket')
const mockedBroadcastObject = broadcastObject as jest.Mock<void>;

describe('Monster sockets', () => {
    beforeEach(async () => {
        mockedBroadcastObject.mockClear();
        await _beforeEach();
        await seedUsers();
        await seedMonsters();
    });
    afterEach(_afterEach);

    it('notify owner when updating', async () => {
        const gm = getGm();
        await updateMonster(monsters[0].id, gm, {
            name: 'New name',
        });
        expect(mockedBroadcastObject.mock.calls).toHaveLength(1);
        const firstCall = mockedBroadcastObject.mock.calls[0];
        expect(firstCall[0]).toEqual(Monster.name);
        const users = firstCall[2];
        expect(users).toHaveLength(1);
        expect(users[0]).toBe(gm.id);
    })

    async function _subscribe() {
        const wizard = getWizard();
        await subscribe(monsters[0].id, wizard);
    }

    it('notify subscribers when updating', async () => {
        const gm = getGm();
        const wizard = getWizard();
        await _subscribe();

        mockedBroadcastObject.mockClear();
        await updateMonster(monsters[0].id, gm, {
            name: 'New name',
        });

        expect(mockedBroadcastObject.mock.calls).toHaveLength(1);
        const users = mockedBroadcastObject.mock.calls[0][2];
        expect(users).toHaveLength(2);
        expect(users).toContain(wizard.id);
    })

    function expectBothUsers() {
        const gm = getGm();
        const wizard = getWizard();
        expect(mockedBroadcastObject.mock.calls).toHaveLength(1);
        const users = mockedBroadcastObject.mock.calls[0][2];
        expect(users).toHaveLength(2);
        expect(users).toContain(gm.id);
        expect(users).toContain(wizard.id);
    }

    it('notify owner and new subscriber when subscribing', async () => {
        await _subscribe();
        expectBothUsers();
    })

    it('notify owner and old subscriber when subscribing', async () => {
        const wizard = getWizard();
        await _subscribe();

        mockedBroadcastObject.mockClear();
        await unsubscribe(monsters[0].id, wizard);

        expectBothUsers();
    })
})
