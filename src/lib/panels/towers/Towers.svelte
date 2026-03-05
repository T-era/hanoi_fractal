<script lang="ts">
    import { onMount } from "svelte";
    import { type Panel } from "../../Hanoi";
    import { getColor, line, rect, type Pos } from "../../canvas_util";
    import { cancelDrag, dragFrom, type DragItem } from "./DragItem";
    import { automation, manual } from "../../stores/SettingStore";

    const WIDTH = 960;
    const HEIGHT = 600;
    const xOfA = WIDTH / 2 - 180;
    const xOfB = WIDTH / 2;
    const xOfC = WIDTH / 2 + 180;
    const yOfLand = 500;
    const heightOfPanel = 20;
    const widthOfTop = 90;
    const widthOfBottom = 20;
    export let a :Panel[] = [];
    export let b :Panel[] = [];
    export let c :Panel[] = [];

    let cnv :HTMLCanvasElement;
    let temp :HTMLCanvasElement;
    let maxPanel = 0;
    onMount(() => {
        maxPanel = Math.max(...[...a, ...b, ...c]);
        redraw();
    });
    function redraw() {
        const ctx = cnv.getContext("2d")!;

        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        const dWidth = (widthOfTop - widthOfBottom) / maxPanel;
        ctx.strokeStyle = "white";
        line(ctx, {x: 0+5, y: yOfLand}, {x: 960-5, y: yOfLand});
        ctx.fillStyle = "pink";
        drawPost(ctx, xOfA);
        drawPost(ctx, xOfB);
        drawPost(ctx, xOfC);
        drawPanels(ctx, a, xOfA, dWidth)
        drawPanels(ctx, b, xOfB, dWidth)
        drawPanels(ctx, c, xOfC, dWidth)

        function drawPost(ctx :CanvasRenderingContext2D, center :number) {
            rect(ctx, {x: center - 1, y: yOfLand }, {x: center + 1, y: yOfLand - (heightOfPanel + 1) * maxPanel})
        }
    }

    function drawPanels(ctx :CanvasRenderingContext2D, ps :Panel[], center :number, d :number) {
        ps.forEach((p, index) => {
            ctx.fillStyle = getColor(p);
            const bottom = yOfLand - (index * heightOfPanel);
            const top = bottom - heightOfPanel;
            const size = widthOfBottom + d * p;
            const left = center - (size / 2);
            const right = left + size;
            rect(ctx, {x: left, y: top}, {x: right, y: bottom});
        })
    }

    let dragging :DragItem|undefined = undefined;

    automation.subscribe(() => {
        if (dragging) {
            console.log("CANCEL");
            cancelDrag(dragging);
            dragging = undefined;
        }
    });

    function posFromEvent(e: MouseEvent) :Pos {
        const clientHeight = (e.target as HTMLCanvasElement).clientHeight;
        const clientWidth = (e.target as HTMLCanvasElement).clientWidth;
        return { x: e.offsetX / clientWidth * 960, y: e.offsetY / clientHeight * 600 };

    }
    function onDragStart(e :MouseEvent) {
        if (dragging) {
            cancelDrag(dragging);
            dragging = undefined;
        }

        const p = posFromEvent(e);
        const from = nearestPole(p);
        dragging = dragFrom(from);

        redraw();
    }
    function onDragging(e :MouseEvent) {
        if (dragging) {
            const p = posFromEvent(e);

            const tempCtx = temp.getContext("2d")!;
            const dWidth = (widthOfTop - widthOfBottom) / maxPanel;
            const size = widthOfBottom + dWidth * dragging.panel;

            tempCtx.clearRect(0,0,WIDTH, HEIGHT);
            tempCtx.fillStyle = getColor(dragging.panel);
            rect(tempCtx, {x: p.x - size / 2, y: p.y - heightOfPanel / 2}, { x: p.x + size / 2, y: p.y + heightOfPanel / 2});
        }
    }
    function onDragEnd(e :MouseEvent) {
        if (dragging) {
            const to = nearestPole(posFromEvent(e));
            const tempCtx = temp.getContext("2d")!;
            if (to === dragging.from) {
                // 同じ場所に戻った
                cancelDrag(dragging);
                dragging = undefined;
                redraw();
            } else if ((to.at(-1) || Number.MAX_VALUE) < dragging.panel) {
                // おけない
                cancelDrag(dragging);
                dragging = undefined;
                redraw();
            } else {
                to.push(dragging.panel);
                dragging = undefined;
                redraw();
                manual.set(true);
            }
            tempCtx.clearRect(0,0,WIDTH, HEIGHT);
        }
    }
    function nearestPole(p :Pos) :Panel[] {
        const da = Math.abs(p.x - xOfA);
        const db = Math.abs(p.x - xOfB);
        const dc = Math.abs(p.x - xOfC);
        if (da < db && dc) {
            console.log("a");
            return a;
        } else if (db < dc) {
            console.log("b");
            return b;
        } else {
            console.log("c");
            return c;
        }
    }
</script>
<div>
    <canvas width={WIDTH} height={HEIGHT} id="temp" bind:this={temp}
    >
    </canvas>
    <canvas width={WIDTH} height={HEIGHT} id="cnv" bind:this={cnv}
        onmousedown={onDragStart}
        onmouseup={onDragEnd}
        onmousemove={onDragging} >
    </canvas>
</div>
<style lang="scss">
div {
    width: 100%;
    height: 100%;
    position: relative;
    canvas#cnv {
        background: rgba(0,0,0,.5);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    canvas#temp {
        background: #400;
        width: 100%;
        height: 100%;
    }
}
</style>