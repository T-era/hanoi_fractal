<script lang="ts">
    const props = $props();
    let keys :string[] = $state([]);
    let selectedKey :string = $state("");

    $effect.pre(() => {
        keys = Object.keys(props);
    });
    $effect(() => {
        selectedKey = keys[0];
    })
</script>
<div class="overall">
    <div class="switcher">
        {#each keys as label}
            <label>{label}<input type="radio" name="tab" value={label} bind:group={selectedKey}></label>
        {/each}
    </div>
    <div class="contents">
    {@render props[selectedKey]?.()}
    </div>
</div>
<style lang="scss">
div.overall {
    height: calc(100% - 2px);
    div.switcher {
        text-align: start;
        vertical-align: baseline;
        label {
            text-align: center;
            cursor: pointer;
            display: inline-block;
            width: 200px;
            border: #888 1px solid;
            border-bottom: none;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            background: #ddd;

            &:has(input:checked) {
                background: #fff;
            }
        }
        input[type="radio"] {
            display: none;
        }
    }
    div.contents {
        border: 1px #888 solid;
        border-top: none;
        background: white;
        padding: 3px;
        height: calc(100% - 2em);
    }
}
</style>