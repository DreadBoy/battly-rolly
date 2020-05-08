import {Monster} from '../../server/encounter';

export function parseMonster(str: string): Monster {
    return JSON.parse(str) as Monster;
}

export function exportMonster(monster: Monster) {
    return JSON.stringify(monster);
}

export function useMonsterParser() {
    throw new Error('Monster parser from text isn\'t supported yet');
    // useEffect(() => {
    //     fetch(m2)
    //         .then((res) => res.text())
    //         .then((text) => text.split('\n').filter(line => !!line && !line.startsWith('#')))
    //         .then((lines) => lines.map(parseMonster))
    //         .then(m => console.log(JSON.stringify(m[0])));
    // }, []);
}
