<script lang="ts">
    export let labels :string[] = [];
    let selectedIndex = 0;

    function onTabSelect(label :string) {
        return () => {
            selectedIndex = labels.indexOf(label);
        }
    }
</script>
<div class="overall">
    <div class="switcher">
        {#each labels as label, index}
            <label>{label}<input type="radio" onclick={onTabSelect(label)} name="tab" checked={index === 0}></label>
        {/each}
    </div>
    <div class="contents">
    {#if selectedIndex === 0}
        <slot name="a"/>
        {:else if selectedIndex === 1}
        <slot name="b"/>
        {:else if selectedIndex === 2}
        <slot name="c"/>
    {/if}
    </div>
</div>
<style lang="scss">
div.overall {
    height: 100%;
    div.switcher {
        text-align: start;
        vertical-align: baseline;
        label {
            text-align: center;
            cursor: pointer;
            display: inline-block;
            width: 200px;
            border: #888 1px solid;
            border-radius: 5px;
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
        height: calc(100% - 2em);
    }
}
</style>