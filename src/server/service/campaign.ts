import {User} from '../model/user';
import {Campaign} from '../model/campaign';
import {HttpError} from '../middlewares/error-middleware';
import {assign, remove, some} from 'lodash';

export const createCampaign = async (gm: User, body: Partial<Campaign>): Promise<Campaign> => {
    const campaign = new Campaign();
    assign(campaign, body);
    campaign.users = [gm];
    campaign.gm = gm;
    await campaign.save();
    return campaign;
};

export const updateCampaign = async (id: string, body: Partial<Campaign>): Promise<Campaign> => {
    const campaign = await Campaign.findOne(id);
    if (!campaign)
        throw new HttpError(404, `Campaign with id ${id} not found`);
    assign(campaign, body);
    await campaign.save();
    return campaign;
};

export const getCampaignsForUser = async (user: User): Promise<Campaign[]> => {
    return Campaign.find({where: {gm: user}});
};

export const getCampaign = async (id: string): Promise<Campaign> => {
    const campaign = await Campaign.findOne(id);
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

export const removeUserFromCampaign = async (id: string, user: User): Promise<void> => {
    const campaign = await getCampaign(id);
    if (!some(campaign.users, ['id', user.id]))
        throw new HttpError(400, 'You are not in this campaign!');
    if (campaign.gm.id === user.id)
        throw new HttpError(400, 'You are GM of this campaign, you can\'t leave it, only delete!');
    remove(campaign.users, ['id', user.id]);
    await campaign.save();
};
