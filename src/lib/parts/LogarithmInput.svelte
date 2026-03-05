<script lang="ts">
type InputProps = {
    min :number,
    max :number,
    step :number,
};
export type Props = {
    title ?:string,
    base :number,
    init :number,
    value :number,
    inputProps :InputProps,
}
let { title = "", base, init, inputProps, value = $bindable() } :Props = $props();

let inputValue = $state(0);
let inputMin = $state(0);
let inputMax = $state(0);

$effect.pre(() => {
    inputValue = init;
    inputMin = Math.log10(inputProps.min) / Math.log10(base);
    inputMax = Math.log10(inputProps.max) / Math.log10(base);
})
$effect(() => {
    value = Math.floor(Math.pow(base, inputValue)) - 1;
})
</script>
<label>
    <span>{title} ({value})</span>
    <input type="range" bind:value={inputValue} min={inputMin} max={inputMax} step={inputProps.step} />
</label>
<style lang="scss">
span {
    display: inline-block;
    width: 6em;
}
</style>