<script lang="ts">
  import Controller from './lib/parts/Controller.svelte';
  import { A, B, C, Hanoi, resolve, type Motion } from './lib/Hanoi';
  import Towers from './lib/panels/towers/Towers.svelte';
  import Logs from './lib/panels/Logs.svelte';
  import Tab from './lib/parts/Tab.svelte';
  import type { LogItem } from './lib/HanoiLog';
  import Graphs from './lib/panels/Graphs.svelte';
  import { automation, manual } from './lib/stores/SettingStore';

  let logs :LogItem[] = $state([])
  let hanoi = $state(new Hanoi(0));
  let result :Motion[] | null = $state(null);
  let steps = $state(false);
  let currentCnt = $state(3);
  let animationIntervalValue = $state(100);

  function onStart(cnt :number) {
    currentCnt = cnt;
    logs = [];
    hanoi = new Hanoi(cnt);
    result = resolve(A, C, B, cnt);
    steps = !steps;
    manual.set(false);
  }
  let onStep = () => {
    automation.set(() => {});
    if (! result) {
      result = resolve(A, C, B, currentCnt);
    }
    const motion = result.shift();
    if (motion) {
      const panel = hanoi.apply(motion);
      steps = ! steps;
      logs.push({motion, panel});
    }
  }
  let onStepAll = () => {
    automation.set(() => {});
    if (! result) {
      result = resolve(A, C, B, currentCnt);
    }

    const loop = (animationIntervalValue === 0);
    do {
      const motion = result.shift();
      if (motion) {
        const panel = hanoi.apply(motion);
        logs.push({motion, panel});
        if (! loop) {
          setTimeout(onStepAll, animationIntervalValue);
        } 
      } else {
        if (loop) {
          break;
        }
      }
    } while(loop);
    steps = ! steps;
  }
</script>
<header>
  <Controller
    cnt={currentCnt}
    bind:interval={animationIntervalValue}
    onStep={onStep}
    onStepAll={onStepAll}
    onStart={onStart}/>
</header>
<main>
  <Tab>
    {#snippet Tower()}
    <div class="tab">
      {#key [steps]}
        <Towers a={hanoi.a} b={hanoi.b} c={hanoi.c} />
      {/key}
    </div>        
    {/snippet}
    {#snippet Log()}
    <div class="tab">
      {#key {steps}}
        <Logs logs={logs} />
      {/key}
    </div>
    {/snippet}
    {#snippet Graph()}
    <div class="tab">
      {#key [steps]}
        <Graphs logs={logs} />
      {/key}
    </div>
    {/snippet}
  </Tab>
</main>

<style lang="scss">
header {
  float: left;
  height: 100%;
  width: 200px;
}
main {
  float: left;
  height: 100%;
  width: calc(100% - 200px);
}
div.tab {
  width: 100%;
  height: 100%;
}
</style>
