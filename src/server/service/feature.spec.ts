import {
    afterEach as _afterEach,
    beforeEach as _beforeEach,
    seedCampaigns,
    seedEncounters,
    seedFeatures,
    seedMonsters,
    seedUsers,
} from '../test-helper/test-helpers'
import {encounters, features, testMonsterFeature} from '../test-helper/test-data';
import {addFeatures, updateFeature} from './feature';
import {getEncounter} from '../repo/encounter';
import {Encounter} from '../model/encounter';
import {broadcastObject} from './socket';

jest.mock('./socket')
const mockedBroadcastObject = broadcastObject as jest.Mock<void>;

describe('Feature service', () => {

    beforeEach(async () => {
        await _beforeEach();
        await seedUsers();
        await seedCampaigns();
        await seedMonsters();
        await seedFeatures();
        await seedEncounters();
    });
    afterEach(_afterEach);

    it('adds monster', async () => {
        // TODO add authentication to this method
        await addFeatures(encounters[0].id, {features: [testMonsterFeature()]});
        const encounter = await getEncounter(encounters[0].id, ['features'])
        expect(encounter.features).toHaveLength(3);
    })

});

describe('Feature sockets', () => {
    beforeEach(async () => {
        mockedBroadcastObject.mockClear();
        await _beforeEach();
        await seedUsers();
        await seedCampaigns();
        await seedMonsters();
        await seedFeatures();
        await seedEncounters();
    });
    afterEach(_afterEach);

    it('notify when adding feature', async () => {
        await addFeatures(encounters[0].id, {features: [testMonsterFeature()]});
        expect(mockedBroadcastObject.mock.calls).toHaveLength(1);
        expect(mockedBroadcastObject.mock.calls[0][0]).toEqual(Encounter.name);
    })

    it('notify when updating feature', async () => {
        await updateFeature(features[0].id, {HP: features[0].HP - 1});
        expect(mockedBroadcastObject.mock.calls).toHaveLength(1);
        expect(mockedBroadcastObject.mock.calls[0][0]).toEqual(Encounter.name);
    })
})
