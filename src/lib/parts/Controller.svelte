<script lang="ts">
    import { animationInterval, manual } from "../stores/SettingStore";
    import Initializer from "./Initializer.svelte";

    export let cnt = 0;
    export let onStep :() => void = () => {};
    export let onStepAll :() => void = () => {};
    export let onStart: (cnt :number) => void = () => {};
    let interval = 0;
    let automationDisabled = false;
    let intervalInput :HTMLInputElement;

    animationInterval.subscribe((value) => {
        interval = value;
    })
    function onRestart(cnt :number) {
        onStart(cnt);
    }
    manual.subscribe(m => {
        automationDisabled = m;
    });

    function intervalChanged() {
        animationInterval.set(intervalInput.valueAsNumber);
    }

</script>
<div class="menu">
    <h1><span class="title">Tower of</span>Hanoi</h1>
    <hr class="underline"/>
    <details open>
        <summary>開始設定</summary>
        <Initializer cnt={cnt} startCallback={onRestart} />
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
                <label>
                    <span>速さ</span>
                    <input type="number" min="0" step="0.01" onchange={intervalChanged} bind:this={intervalInput} value={interval}/>
                    <span>秒</span>
                </label>
            </div>
        </details>
    </details>
</div>
<style lang="scss">
div.menu {
    text-align: start;
    width: calc(100% - 10px);
    height: 100%;
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

    input {
        width: 40%;
    }
}
</style>