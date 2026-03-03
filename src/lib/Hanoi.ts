export type Panel  = number;

export type Position = (h :Hanoi) => Panel[];
export const A :Position = h => h.a;
export const B :Position = h => h.b;
export const C :Position = h => h.c;

export type Motion = { from :Position, to :Position }
export const AtoB :Motion = { from: A, to: B };
export const AtoC :Motion = { from: A, to: C };
export const BtoA :Motion = { from: B, to: A };
export const BtoC :Motion = { from: B, to: C };
export const CtoA :Motion = { from: C, to: A };
export const CtoB :Motion = { from: C, to: B };

export class Hanoi {
    a :Panel[];
    b :Panel[] = [];
    c :Panel[] = [];

    constructor(private cnt :number) {
        this.a = [...initPanels(cnt)];
    }

    apply(m :Motion) {
        const from = m.from(this);
        const to = m.to(this);
        // console.log(`${from}->${to}`)
        const moving = from.pop() || 0;
        const topOfTo = to.at(-1) || Number.MAX_VALUE;
        if (moving >= topOfTo) {
            // 失敗したので元の位置に。
            from.push(moving);
            throw `Illegal motion: ${moving} on ${topOfTo}`
        }
        to.push(moving);
        return moving;
    }
}

function* initPanels(cnt :number) : Generator<Panel> {
    for (let i = cnt; i > 0; i --) {
        yield i;
    }
}

export function resolve(from :Position, to :Position, other :Position, cnt :number) :Motion[] {
    if (cnt === 0) return [];
    return [
        ...resolve(from, other, to, cnt - 1),
        {from,to},
        ...resolve(other, to, from, cnt - 1)
    ];
}