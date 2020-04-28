import {ActionDict, grammar as ohm} from 'ohm-js';
import {difference, filter, flatMap, isString} from 'lodash';
import {readFileSync} from 'fs';
import {join} from 'path';
import {Ability, Damage, DamageType, IAoE, IDirect, Roll} from './server/model/action';

const bestiary = require('./assets/Monster Manual Bestiary 2.6.0.json');
const actions = filter(flatMap(bestiary, 'action'), Boolean);
console.log('all', actions.length);

let rest = actions.slice();

const noText = filter(actions, (a: any) => !isString(a.text));
rest = difference(rest, noText);
console.log('noText', noText.length);

const multiAttack = filter(actions, ['name', 'Multiattack']);
rest = difference(rest, multiAttack);
console.log('multiAttack', multiAttack.length);

const grammar = ohm(readFileSync(join(__dirname, 'grammar.ohm'), 'utf8'));
const semantic = grammar.createSemantics();
semantic.addOperation(
    'eval',
    {
        aoe: function (start, dc): Partial<IAoE> {
            return {
                type: 'aoe',
                // ...dc.eval(),
            }
        },
        aoeStart: function(_1, digit, _2, digit2, _3) {
          return this.sourceString;
        },
        dc: function ( _1, dc, _2, ability, _3, damage, _4): Partial<IAoE> {
            const dmg: Damage = damage.eval();
            return {
                DC: dc.eval(),
                ability: ability.sourceString as Ability,
                damage: dmg,
            }
        },
        meleeRanged: function (_1, modifier, _2, _3, _4, _5, _6, _7, _8, _9, _10, hit): Partial<IDirect> {
            return {
                type: 'direct',
                modifier: modifier.eval(),
                damage: hit.eval(),
            }
        },
        melee: function (_1, modifier, _2, _3, _4, _5, _6, hit): Partial<IDirect> {
            return {
                type: 'direct',
                modifier: modifier.eval(),
                damage: hit.eval(),
            }
        },
        ranged: function (_1, modifier, _2, _3, _4, _5, _6, _7, _8, hit): Partial<IDirect> {
            return {
                type: 'direct',
                modifier: modifier.eval(),
                damage: hit.eval(),
            }
        },
        hit_extraType: function (s1, damage, s2, plus, s3): Damage[] {
            return [damage.eval(), plus.eval()];
        },
        hit_simpleType: function (s1, damage, s2): Damage {
            return damage.eval();
        },
        damage: function (roll, s1, type, s2): Damage {
            return {
                roll: roll.eval(),
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
let parsed = filter(rest, a => grammar.match(a.text).succeeded());
rest = difference(rest, parsed);
console.log('parsed', parsed.length);

console.log('rest', rest.length);
console.log('*************');

function gr(text: string) {
    const match = grammar.match(text);
    console.log(text);
    console.log(grammar.match(text).succeeded());
    const result = semantic(match).eval();
    console.log(result);
    // console.log(grammar.trace(text).toString());
}

gr('The dragon exhales lightning in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 22 (4d10) lightning damage on a failed save, or half as much damage on a successful one.');


// export const fake = 1;
// console.log(rest.slice(50, 60));
