import {createEncounter, deleteEncounter, getEncounter, toggleActiveEncounter} from './encounter';
import {afterEach as _afterEach, beforeEach as _beforeEach, seedCampaigns, seedUsers} from '../test-helper/test-helpers'
import {campaigns, getGm, testEncounter} from '../test-helper/test-data';
import {HttpError} from '../middlewares/error-middleware';

jest.mock('./socket')

describe('Encounter service', () => {

    beforeEach(async () => {
        await _beforeEach();
        await seedUsers();
        await seedCampaigns();
    });
    afterEach(_afterEach);

    it('creates encounter', async () => {
        const gm = getGm();
        const encounter = await createEncounter(campaigns[0].id, gm, testEncounter());
        expect(encounter).toMatchObject(testEncounter());
    })

    it('sets new encounter as inactive', async () => {
        const gm = getGm();
        const encounter = await createEncounter(campaigns[0].id, gm, testEncounter());
        expect(encounter.active).toBeFalsy();
    })

    it('toggles active flag of encounter', async () => {
        const gm = getGm();
        let encounter = await createEncounter(campaigns[0].id, gm, testEncounter());
        await toggleActiveEncounter(encounter.id, gm);
        encounter = await getEncounter(encounter.id);
        expect(encounter.active).toBeTruthy();
    })

    it('sets other encounters in campaign to inactive', async () => {
        const gm = getGm();
        let encounter1 = await createEncounter(campaigns[0].id, gm, testEncounter());
        let encounter2 = await createEncounter(campaigns[0].id, gm, testEncounter());
        await toggleActiveEncounter(encounter1.id, gm);
        await toggleActiveEncounter(encounter2.id, gm);
        encounter1 = await getEncounter(encounter1.id);
        encounter2 = await getEncounter(encounter2.id);
        expect(encounter1.active).toBeFalsy();
        expect(encounter2.active).toBeTruthy();
    })

    it('automatically adds users to active encounter', async () => {
        const gm = getGm();
        let encounter = await createEncounter(campaigns[0].id, gm, testEncounter());
        await toggleActiveEncounter(encounter.id, gm);
        encounter = await getEncounter(encounter.id);
        expect(encounter.features).toHaveLength(1);
    })

    it('automatically removes users from inactive encounter', async () => {
        const gm = getGm();
        let encounter = await createEncounter(campaigns[0].id, gm, testEncounter());
        await toggleActiveEncounter(encounter.id, gm);
        await toggleActiveEncounter(encounter.id, gm);
        encounter = await getEncounter(encounter.id);
        expect(encounter.features).toHaveLength(0);
    })

    it('removes inactive encounter', async () => {
        const gm = getGm();
        let encounter = await createEncounter(campaigns[0].id, gm, testEncounter());
        await deleteEncounter(encounter.id, gm);
        await expect(getEncounter(encounter.id)).rejects.toBeInstanceOf(HttpError);
    })

    it('removes active encounter', async () => {
        const gm = getGm();
        let encounter = await createEncounter(campaigns[0].id, gm, testEncounter());
        await toggleActiveEncounter(encounter.id, gm);
        await deleteEncounter(encounter.id, gm);
        await expect(getEncounter(encounter.id)).rejects.toBeInstanceOf(HttpError);
    })
});
