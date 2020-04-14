import {ActionDict, grammar as ohm} from 'ohm-js';
import {Direct, Damage, DamageType, Roll} from './client/v2/types/bestiary';
import {difference, filter, flatMap, isString} from 'lodash';
import {readFileSync} from 'fs';
import {join} from 'path';

const bestiary = require('./assets/Monster Manual Bestiary 2.6.0.json');
const actions = filter(flatMap(bestiary, 'action'), Boolean);
console.log('all', actions.length);

let rest = actions.slice();

const noText = filter(actions, (a: any) => !isString(a.text));
rest = difference(rest, noText);
console.log('noText', noText.length);

const grammar = ohm(readFileSync(join(__dirname, 'grammar.ohm'), 'utf8'));
const semantic = grammar.createSemantics();
semantic.addOperation(
    'eval',
    {
        direct: function (start, _, hit): Partial<Direct> {
            return {
                type: 'direct',
                modifier: start.eval(),
                damage: hit.eval(),
            }
        },
        directStart: function (_1, modifier, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12): number {
            return modifier.eval();
        },
        attackType: function (_) {
            return _.sourceString;
        },
        directHit_extraType: function (s1, damage, s2, plus, s3): Damage[] {
            return [damage.eval(), plus.eval()];
        },
        directHit_simpleType: function (s1, damage, s2): Damage {
            return damage.eval();
        },
        damage: function (roll, s1, type, s2): Damage {
            return {
                rolls: [roll.eval()],
                damageType: type.sourceString as any as DamageType,
            }
        },
        roll_withModifier: function (average, p1, first, d, second, s1, modifier, p2): Roll {
            return [first.eval(), second.eval(), modifier.eval()];
        },
        roll_noModifier: function (average, p1, first, d, second, p2): Roll {
            return [first.eval(), second.eval(), 0];
        },
        roll_simple: function (number): Roll {
            return [0, 0, number.eval()];
        },
        target: function (_) {
            return this.sourceString;
        },
        modifier: function (sign, _, number): number {
            return parseInt(sign.eval() + number.eval().toString(), 10)
        },
        sign: function (sign) {
            return sign.sourceString;
        },
        number: function (num): number {
            return parseInt(num.sourceString, 10);
        },
    } as ActionDict,
)
let direct = filter(rest, a => {
    const match = grammar.match(a.text);
    if (match.failed())
        return false;
    const result = semantic(match).eval();

});
rest = difference(rest, direct);
console.log('direct', direct.length);

console.log('rest', rest.length);
console.log('*************');

function gr(text: string) {
    const match = grammar.match(text);
    console.log(text);
    console.log(grammar.match(text).succeeded());
    const result = semantic(match).eval();
    console.log(result);
}

// gr('Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage plus 4 (1d8 + 1) acid damage.');


// export const fake = 1;
// console.log(direct.slice(0, 10));
