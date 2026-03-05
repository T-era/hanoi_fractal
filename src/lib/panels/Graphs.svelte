<script lang="ts">
    import type { LogItem } from "../HanoiLog";
    import { A, B, C, type Motion } from "../Hanoi";
    import { getColor, line } from "../canvas_util";

    const WIDTH = 960;
    const HEIGHT = 600;
    const SCALE = 240;

    export type Props = { logs :LogItem[] };
    const { logs } :Props = $props()

    let cnv :HTMLCanvasElement;
    $effect(() => {
        const ctx = cnv.getContext("2d")!;

        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        drawLogs(ctx, logs);
    });

    function drawLogs(ctx: CanvasRenderingContext2D, logs :LogItem[]) {
        const panelAll = logs.map(li => li.panel);
        const max = Math.max(...panelAll);

        ctx.strokeStyle = "white";
        ctx.moveTo(WIDTH / 2 - SCALE, HEIGHT / 2);
        let temp = { x: WIDTH / 2 - SCALE, y: HEIGHT  * 3 / 4 }
        for (let logItem of logs) {
            const p = logItem.panel;
            ctx.strokeStyle = getColor(p);
            const rad = radFromMotion(logItem.motion) / 180 * Math.PI;
            const len = SCALE * Math.pow(0.61, max - logItem.panel);
            const next = { x: temp.x + Math.cos(rad) * len, y: temp.y - Math.sin(rad) * len };
            line(ctx, temp, next);
            temp = next;
        }
        ctx.stroke();
    }
    function radFromMotion(motion :Motion) {
        if (motion.from === A) {
            if (motion.to === B) {
                return 60;
            } else if (motion.to === C) {
                return 0;
            }
        } else if (motion.from === B) {
            if (motion.to === A) {
                return 240;
            } else if (motion.to === C) {
                return 300;
            }
        } else if (motion.from === C) {
            if (motion.to === A) {
                return 180;
            } else if (motion.to === B) {
                return 120;
            }
        }
        throw "Unknown motion"
    }
</script>
<canvas width={WIDTH} height={HEIGHT} id="graph" bind:this={cnv}>
</canvas>
<style>
    canvas {
        background: black;
        width: 100%;
        height: 100%;
    }
</style>