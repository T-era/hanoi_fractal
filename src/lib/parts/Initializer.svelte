<script lang="ts">
    import type { Func1 } from "../callback";

    type Props = { cnt :number, startCallback :Func1<number> };
    let { cnt, startCallback } :Props = $props();

    function onStarted() {
        startCallback(cnt);
    }
</script>
<div>
    <label>
        <span>パネル</span>
        <input type="number" min="1" bind:value={cnt} />
        <span>枚</span>
    </label>
    <div class="buttons">
        <button onclick={onStarted}>Start</button>
    </div>
</div>
<style lang="scss">
    label {
        input {
            width: 50%;
        }
    }
    div.buttons {
        text-align: end;
    }
</style>
