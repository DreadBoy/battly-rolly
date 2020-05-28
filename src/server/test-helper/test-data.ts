import {User} from '../model/user';
import {Encounter} from '../model/encounter';

export function getGm() {
    return users[0] as User;
}

export function getWizard() {
    return users[1] as User;
}

export function testCampaign() {
    return {
        name: 'Test campaign',
    };
}

export function testEncounter() {
    return {
        name: 'Test encounter',
    } as Encounter;
}

export const users = [{
    id: '56253fc4-252d-4f4c-9207-032171d62d8c',
    email: 'gm@example.com',
    displayName: 'Test',
    password: 'test',
} as User, {
    id: 'd8e95e8f-ff24-4d5c-95cc-e8ae54246f36',
    email: 'wizard@example.com',
    displayName: 'Wizard',
    password: 'wizard',
} as User];
export const campaigns = [{
    ...testCampaign(),
    id: '021376e9-4acd-4d3d-8d71-eebaf6daedc3',
    gm: getGm(),
    users: [getGm()],
},{
    name: 'Working campaign',
    id: 'f0e50d24-2d37-45de-bdce-fe6a6146f9a4',
    gm: getGm(),
    users: [getGm(), getWizard()],
}];
export const encounters = [{
    ...testEncounter(),
    id: 'd157e76f-1961-45b2-9be1-b77e3b1a22cd',
}];
