import {User} from '../model/user';
import {Encounter} from '../model/encounter';
import {Campaign} from '../model/campaign';
import {Monster} from '../model/monster';
import {AddFeature} from '../repo/feature';
import {Feature} from '../model/feature';

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

export function testMonsterFeature() {
    return {
        AC: 11,
        HP: 11,
        initialHP: 11,
        reference: '7cf61eba-935f-450e-9e8a-0e907748fe64',
        type: 'npc',
    } as AddFeature;
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
    id: 'f0e50d24-2d37-45de-bdce-fe6a6146f9a4',
    name: 'Actual campaign',
    gm: getGm(),
    users: [getGm(), getWizard()],
} as Campaign];
export const monsters = [{
    id: '7cf61eba-935f-450e-9e8a-0e907748fe64',
    owner: getGm(),
    name: 'Boar',
    HP: [2, 8, 2],
    AC: 11,
    abilitySet: {
        strength: 13,
        dexterity: 11,
        constitution: 12,
        intelligence: 2,
        wisdom: 9,
        charisma: 5,
    },
    savingThrows: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
    },
    actions: [
        {
            type: 'direct',
            name: 'Tusk',
            modifier: 3,
            damage: {
                roll: [1, 6, 1],
                damageType: 'slashing',
            },
        },
        {
            type: 'direct',
            name: 'Charge + Tusks',
            modifier: 3,
            damage: {
                roll: [2, 6, 1],
                damageType: 'slashing',
            },
        },
        {
            type: 'aoe',
            name: 'Charge after-effect',
            DC: 11,
            ability: 'strength',
            status: 'prone',
        },
    ],
} as Monster]
export const features = [{
    id: 'e16c4d10-dd62-4190-b03a-a89c1afd8121',
    player: getWizard(),
    AC: 15,
    HP: 40,
    initialHP: 40,
} as Feature, {
    id: '809ba8ff-b376-4f15-9e92-a0a49a3eaf12',
    monster: monsters[0],
    AC: 11,
    HP: 13,
    initialHP: 13,
} as Feature]
export const encounters = [{
    id: 'd157e76f-1961-45b2-9be1-b77e3b1a22cd',
    name: 'Actual encounter',
    active: true,
    campaign: campaigns[0],
    features: [features[0], features[1]],
} as Encounter];
