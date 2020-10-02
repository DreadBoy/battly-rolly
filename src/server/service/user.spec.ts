import {afterEach as _afterEach, beforeEach as _beforeEach, seedUsers} from '../test-helper/test-helpers'
import {users} from '../test-helper/test-data';
import {broadcastObject} from './socket';
import {User} from '../model/user';
import {updateUser} from './user';

jest.mock('../model/reactive-entity');
jest.mock('./socket')
const mockedBroadcastObject = broadcastObject as jest.Mock<void>;

describe('User sockets', () => {
    beforeEach(async () => {
        mockedBroadcastObject.mockClear();
        await _beforeEach();
        await seedUsers();
    });
    afterEach(_afterEach);

    it('notify user when updating', async () => {
        await updateUser(users[1].id, {
            displayName: 'New name',
            email: users[1].email,
        });
        expect(mockedBroadcastObject.mock.calls).toHaveLength(1);
        const firstCall = mockedBroadcastObject.mock.calls[0];
        expect(firstCall[0]).toEqual(User.name);
        const _users = firstCall[2];
        expect(_users).toHaveLength(1);
        expect(_users[0]).toBe(users[1].id);
    })
})
