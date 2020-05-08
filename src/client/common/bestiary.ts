import {useEffect} from 'react';
import bestiary from '../../assets/Monster Manual Bestiary 2.6.0.json';
import {AbilitySet, Attack, Damage, DamageType, Monster, Roll} from '../../server/encounter';
import {chain} from 'lodash';

const mapper: { [short: string]: keyof AbilitySet } = {
    Str: 'strength',
    Dex: 'dexterity',
    Con: 'constitution',
    Int: 'intelligence',
    Wis: 'wisdom',
    Cha: 'charisma',
};

function scoreToMod(score: number) {
    return Math.floor(score / 2) - 5;
}

export function useBestiary() {
    function bestiaryToMonster(m: any): Monster {
        // Avatar of Death
        let HP: Roll = [0, 0, 0];
        if (m.hp !== 0) {
            const HPMatch = m.hp.toString().match(/\((.*?)d(.*?)(\+.*?)?\)/);
            if (!HPMatch)
                throw new Error(`HP: ${m.hp}`);
            HP = [parseInt(HPMatch[1]), parseInt(HPMatch[2]), HPMatch[3] ? parseInt(HPMatch[3]) : 0];
        }
        const ACMatch = m.ac.toString().match(/^(\d*?)( .*?)?$/);
        if (!ACMatch)
            throw new Error(`AC: ${m.ac}`);
        const AC: number = parseInt(ACMatch[1]);
        const abilitySet: AbilitySet = {
            strength: m.str,
            dexterity: m.dex,
            constitution: m.con,
            intelligence: m.int,
            wisdom: m.wis,
            charisma: m.cha,

        };
        const savingThrows: AbilitySet = {
            strength: scoreToMod(abilitySet.strength),
            dexterity: scoreToMod(abilitySet.dexterity),
            constitution: scoreToMod(abilitySet.constitution),
            intelligence: scoreToMod(abilitySet.intelligence),
            wisdom: scoreToMod(abilitySet.wisdom),
            charisma: scoreToMod(abilitySet.charisma),
        };
        m.save?.split(', ')
            .map((s: string) => s.match(/^(.*?) (.*?)$/))
            .filter(Boolean)
            .forEach((match: RegExpMatchArray) => {
                savingThrows[mapper[match[1]]] = parseInt(match[2]);
            });

        return {
            id: '',
            name: m.name,
            HP,
            currentHP: 0,
            maxHP: 0,
            AC,
            abilitySet,
            savingThrows,
            actions: [],
        }
    }

    function parseAction(action: { name: string, text: string }): Attack | null {
        // @ts-ignore
        const ret: Attack = {
            name: action.name,
            type: 'attack',
        };
        const damageRegExp = / \d+? \((\d+?)d(\d+?)(?: ([+-] \d+?))?\) (\w+?) damage/;
        const parseSingleDamage = (text: string): Damage => {
            const match = text.match(damageRegExp);
            if (!match)
                throw new Error(`Single damage match was null: ${text}`);
            return {
                rolls: [[
                    parseInt(match[0][1]),
                    parseInt(match[0][2]),
                    match[0].length === 5 ? parseInt(match[0][3].replace(' ', '')) : 0,
                ]],
                damageType: match[0][4] as DamageType,
            };
        };
        let textMatch: RegExpMatchArray | null;

        if(!action.text.match)
            throw new Error(`Text was null: ${JSON.stringify(action)}`);

        // eslint-disable-next-line no-cond-assign
        if (textMatch = action.text.match(/^Melee Weapon Attack: (\+\d*?) to hit,/)) {
            ret.modifier = parseInt(textMatch[1]);
            ret.damage = parseSingleDamage(action.text);
        // } else if (textMatch = action.text.match(/^Melee or Ranged Weapon Attack: (\+\d*?) to hit,/)) {
        //     ret.modifier = parseInt(textMatch[1]);
        // } else {
        //     console.log(action.text);
        //     return null;
        }
        return ret;
    }

    useEffect(() => {
        const keys = chain(bestiary as any[])
            .filter(m => !!m.action)
            .flatMap<any>(m => Array.isArray(m.action) ? m.action : [m.action])
            .filter(act => !!act.attack)
            .map<Attack | null>(action => parseAction(action))
            .filter(Boolean)
            .value();
        console.log(keys);
        // console.log(objs);
        // console.log(bestiary.map(bestiaryToMonster));
        // bestiary.map(monster => )
    })
}
