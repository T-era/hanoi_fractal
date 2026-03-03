export type Pos = { x:number, y:number };

export function line(ctx :CanvasRenderingContext2D, p1 :Pos, p2 :Pos) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}
export function rect(ctx :CanvasRenderingContext2D, p1 :Pos, p2 :Pos) {
    const w = p2.x - p1.x;
    const h = p2.y - p1.y;
    ctx.beginPath();
    ctx.fillRect(p1.x, p1.y, w || 1, h || 1);
    ctx.fill();
}

const COLORS = [
    "#fdd",
    "#ddf",
    "#dfd",
    "#eed",
    "#dee",
    "#ede",
];

export function getColor(n :number) {
    const index = n % COLORS.length;
    return COLORS[index];
}