import {User} from '../model/user';
import {Campaign} from '../model/campaign';
import {HttpError} from '../middlewares/error-middleware';
import {assign, remove, some} from 'lodash';
import {getUser} from './user';
import {validateObject} from '../middlewares/validators';

export const createCampaign = async (gm: User, body: Partial<Campaign>): Promise<Campaign> => {
    body = validateObject(body, ['name']);
    const campaign = new Campaign();
    assign(campaign, body);
    campaign.users = [gm];
    campaign.gm = gm;
    await campaign.save();
    return campaign;
};

export const updateCampaign = async (id: string, body: Partial<Campaign>): Promise<Campaign> => {
    body = validateObject(body, ['name']);
    const campaign = await getCampaign(id);
    assign(campaign, body);
    await campaign.save();
    return campaign;
};

export const getCampaignsForUser = async (user: User): Promise<Campaign[]> => {
    user = await getUser(user.id, ['campaigns']);
    return user.campaigns;
};

export const getCampaign = async (id: string, relations: string[] = []): Promise<Campaign> => {
    const campaign = await Campaign.findOne(id, {relations});
    if (!campaign)
        throw new HttpError(404, `Campaign with id ${id} not found`);
    return campaign;
};

export const deleteCampaign = async (id: string, user: User): Promise<void> => {
    const campaign = await getCampaign(id);
    if (campaign.gm.id !== user.id)
        throw new HttpError(403, 'You are not GM of this campaign, you can\'t delete it!');
    await Campaign.remove(campaign);
};

export const addUserToCampaign = async (id: string, user: User): Promise<void> => {
    const campaign = await getCampaign(id);
    if (some(campaign.users, ['id', user.id]))
        throw new HttpError(400, 'You are already in this campaign!');
    campaign.users.push(user);
    await campaign.save();
};

export const removeUserFromCampaign = async (id: string, authenticatedUser: User, user: Partial<User>): Promise<void> => {
    user = validateObject(user, ['id']);
    const campaign = await getCampaign(id);
    if (!some(campaign.users, ['id', user.id]))
        throw new HttpError(400, 'You are not in this campaign!');
    if (campaign.gm.id === user.id)
        throw new HttpError(400, 'You are GM of this campaign, you can\'t leave it, only delete!');
    if (authenticatedUser.id !== campaign.gm.id && authenticatedUser.id !== user.id)
        throw new HttpError(403, 'You can\'t kick other players unless you are GM!');
    remove(campaign.users, ['id', user.id]);
    await campaign.save();
};
