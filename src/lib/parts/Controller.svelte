<script lang="ts">
    import type { Func, Func1 } from "../callback";
    import { manual } from "../stores/SettingStore";
    import Initializer from "./Initializer.svelte";
    import LogarithmInput from "./LogarithmInput.svelte";

    export type Props = {
        cnt :number,
        interval :number,
        onStep :Func,
        onStepAll :Func,
        onStart :Func1<number>,
    };
    let { cnt, interval = $bindable(), onStep, onStepAll, onStart } :Props = $props();

    let automationDisabled = $state(false);

    manual.subscribe(m => {
        automationDisabled = m;
    });

    function setInterval(val :number) {
        interval = val;
    }

</script>
<div class="menu">
    <h1><span class="title">Tower of</span>Hanoi</h1>
    <hr class="underline"/>
    <details open>
        <summary>開始設定</summary>
        <Initializer cnt={cnt} startCallback={onStart} />
    </details>

    <details>
        <summary>自動解決</summary>
        <button onclick={onStep} disabled={automationDisabled}>➤</button>
        <button onclick={onStepAll} disabled={automationDisabled}>
            ➤|
        </button>
        <details>
            <summary>設定</summary>
            <div>
                <LogarithmInput
                    bind:value={() => interval, setInterval}
                    title="速さ"
                    base={10} init={2}
                    inputProps={{ min: 0, max: 1000, step: 0.01 }} />
            </div>
        </details>
    </details>
</div>
<style lang="scss">
div.menu {
    text-align: start;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    padding: 5px;
    h1 {
        span {
            display: inline-block;;
            font-size: 0.3em;
        }
        margin: 0;
    }
    hr.underline {
        border-top: 2px dotted;
        margin-bottom: 2em;
    }
}
</style>