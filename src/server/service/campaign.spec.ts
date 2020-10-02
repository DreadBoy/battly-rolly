import {
    addUserToCampaign,
    createCampaign,
    deleteCampaign,
    getCampaign,
    getCampaignsForUser,
    removeUserFromCampaign,
    updateCampaign,
} from './campaign';
import {afterEach as _afterEach, beforeEach as _beforeEach, seedUsers} from '../test-helper/test-helpers'
import {getGm, getWizard, testCampaign} from '../test-helper/test-data';
import {some} from 'lodash';
import {HttpError} from '../middlewares/error-middleware';
import {broadcastObject} from './socket';

jest.mock('../model/reactive-entity');
jest.mock('./socket')
const mockedBroadcastObject = broadcastObject as jest.Mock<void>;

async function _createCampaignAndJoin() {
    const gm = getGm();
    const campaign = await createCampaign(gm, testCampaign());
    const w = getWizard();
    await addUserToCampaign(campaign.id, w);
    return campaign;
}

describe('Campaign service', () => {

    beforeEach(async () => {
        mockedBroadcastObject.mockClear();
        await _beforeEach();
        await seedUsers();
    });
    afterEach(_afterEach);

    it('creates campaign', async () => {
        const gm = getGm();
        const campaign = await createCampaign(gm, testCampaign());
        expect(campaign).toMatchObject(testCampaign());
    })

    it('adds creator to campaign\'s users', async () => {
        const gm = getGm();
        const campaign = await createCampaign(gm, testCampaign());
        expect(some(campaign.users, ['id', gm.id])).toBeTruthy();
    })

    it('returns created campaign', async () => {
        const gm = getGm();
        await createCampaign(gm, testCampaign());
        const campaigns = await getCampaignsForUser(gm);
        expect(campaigns.length).toBeGreaterThan(0);
        expect(some(campaigns, ['name', 'Test campaign'])).toBeTruthy();
    })

    it('updates campaign', async () => {
        const gm = getGm();
        let campaign = await createCampaign(gm, testCampaign());
        await updateCampaign(campaign.id, {name: 'New name'});
        campaign = await getCampaign(campaign.id);
        expect(campaign.name).toBe('New name');
    })

    it('deletes created campaign', async () => {
        const gm = getGm();
        const campaign = await createCampaign(gm, testCampaign());
        await deleteCampaign(campaign.id, gm);
        const campaigns = await getCampaignsForUser(gm);
        expect(some(campaigns, ['name', 'Test campaign'])).toBeFalsy();
    })

    it('doesn\'t allow deleting campaign that isn\'t owned by user', async () => {
        const gm = getGm();
        const campaign = await createCampaign(gm, testCampaign());
        const w = getWizard();
        await expect(deleteCampaign(campaign.id, w)).rejects.toBeInstanceOf(HttpError);
    })

    it('join campaign', async () => {
        await _createCampaignAndJoin();

        const w = getWizard();
        const campaigns = await getCampaignsForUser(w);
        expect(campaigns.length).toBeGreaterThan(0);
        expect(some(campaigns, ['name', testCampaign().name])).toBeTruthy();
    })

    it('leave campaign', async () => {
        const campaign = await _createCampaignAndJoin();

        const w = getWizard();
        await removeUserFromCampaign(campaign.id, w, w);
        const campaigns = await getCampaignsForUser(w);
        expect(campaigns.length).toBe(0);
    })

    it('kick user from campaign', async () => {
        const campaign = await _createCampaignAndJoin();

        const gm = getGm();
        const w = getWizard();
        await removeUserFromCampaign(campaign.id, gm, w);
        const campaigns = await getCampaignsForUser(w);
        expect(campaigns.length).toBe(0);
    })

    it('doesn\'t allow kicking from campaign that isn\'t owned by user', async () => {
        const campaign = await _createCampaignAndJoin();

        const gm = getGm();
        const w = getWizard();
        await expect(removeUserFromCampaign(campaign.id, w, gm)).rejects.toBeInstanceOf(HttpError);
    })

    it('doesn\'t allow leaving campaign that is owned by user', async () => {
        const campaign = await _createCampaignAndJoin();

        const gm = getGm();
        await expect(removeUserFromCampaign(campaign.id, gm, gm)).rejects.toBeInstanceOf(HttpError);
    })
})

describe('Campaign sockets', () => {

    beforeEach(async () => {
        mockedBroadcastObject.mockClear();
        await _beforeEach();
        await seedUsers();
    });
    afterEach(_afterEach);

    it('notify after update', async () => {
        const gm = getGm();
        const update = {name: 'New name'};
        let campaign = await createCampaign(gm, testCampaign());
        await updateCampaign(campaign.id, update);
        expect(mockedBroadcastObject.mock.calls).toHaveLength(1);
        expect(mockedBroadcastObject.mock.calls[0][1].name).toEqual(update.name);
    })

    it('notify after user joins', async () => {
        await _createCampaignAndJoin();
        expect(mockedBroadcastObject.mock.calls).toHaveLength(1);
        expect(mockedBroadcastObject.mock.calls[0][2]).toContain(getGm().id);
        expect(mockedBroadcastObject.mock.calls[0][2]).toContain(getWizard().id);
    })

    it('notify remaining users after user leaves', async () => {
        const campaign = await _createCampaignAndJoin();
        const w = getWizard();
        mockedBroadcastObject.mockClear();
        await removeUserFromCampaign(campaign.id, w, w);
        expect(mockedBroadcastObject.mock.calls).toHaveLength(1);
        expect(mockedBroadcastObject.mock.calls[0][2]).toContain(getGm().id);
    })

    it('notify leaving user', async () => {
        const campaign = await _createCampaignAndJoin();
        const w = getWizard();
        mockedBroadcastObject.mockClear();
        await removeUserFromCampaign(campaign.id, w, w);
        expect(mockedBroadcastObject.mock.calls).toHaveLength(1);
        expect(mockedBroadcastObject.mock.calls[0][2]).toContain(w.id);
    })
})
