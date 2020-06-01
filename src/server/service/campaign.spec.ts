import {createCampaign} from './campaign';
import {afterEach as _afterEach, beforeEach as _beforeEach} from '../test-helper/test-helpers'
import {getGm} from '../test-helper/seed-mifration';

describe('Campaign service', () => {

    beforeEach(_beforeEach);
    afterEach(_afterEach);

    it('creates campaign', async () => {
        const gm = await getGm();
        const campaign = await createCampaign(gm, {
            name: 'Test campaign',
        });
        expect(campaign).toMatchObject({name: 'Test campaign'});
    })
})
