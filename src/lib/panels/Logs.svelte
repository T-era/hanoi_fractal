<script lang="ts">
    import { A, B, C, type Motion, type Position } from "../Hanoi";
    import type { LogItem } from "../HanoiLog";

    export type Props = { logs :LogItem[] };
    const { logs } :Props = $props();

    let logText = $state("");

    $effect(() => {
        logText = logs.map(({panel, motion}) => `(${panel}) ${strFromMotion(motion)}`).join("\n")
    })

    function strFromMotion(motion :Motion) {
        return `${strFromPosition(motion.from)} -> ${strFromPosition(motion.to)}`;
    }
    function strFromPosition(p :Position) {
        if (p === A) {
            return "A"
        } else if (p === B) {
            return "B"
        } else if (p === C) {
            return "C"
        } else {
            return "X"
        }
    }
</script>
<textarea readonly value={logText}></textarea>
<style>
    textarea {
        background: #004;
        color: #0f0;
        width: calc(100% - 10px);
        height: calc(100% - 10px);
    }
</style>