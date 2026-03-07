<script lang="ts">
  import Controller from './lib/parts/Controller.svelte';
  import { A, B, C, Hanoi, resolve, resolveG, type Motion } from './lib/Hanoi';
  import Towers from './lib/panels/towers/Towers.svelte';
  import Logs from './lib/panels/Logs.svelte';
  import Tab from './lib/parts/Tab.svelte';
  import type { LogItem } from './lib/HanoiLog';
  import Graphs from './lib/panels/Graphs.svelte';
  import { automation, manual } from './lib/stores/SettingStore';

  const LOOP_MAX = 10000; // 画面をフリーズさせないための、連続ループ回数のマックス

  let logs :LogItem[] = $state([])
  let hanoi = new Hanoi(0);
  let result :Generator<Motion> | null = null;
  let steps = $state(false);
  let currentCnt = $state(3);
  let animationIntervalValue = $state(100);

  function onStart(cnt :number) {
    currentCnt = cnt;
    logs = [];
    hanoi = new Hanoi(cnt);
    result = null;
    steps = !steps;
    manual.set(false);
  }
  let onStep = () => {
    automation.set(() => {});
    if (! result) {
      result = resolveG(A, C, B, currentCnt);
    }
    const motion = result.next().value;
    if (motion) {
      const panel = hanoi.apply(motion);
      steps = ! steps;
      logs.push({motion, panel});
    }
  }
  let onStepAll = () => {
    automation.set(() => {});
    if (! result) {
      result = resolveG(A, C, B, currentCnt);
    }

    const loop = (animationIntervalValue === 0);
    if (loop) {
      let motion = null;
      for (let i = 0; i < LOOP_MAX; i ++) {
        //
        motion = applyOneMotion(result);
        if (! motion) {
          break;
        }
      }
      if (motion) {
        setTimeout(onStepAll, 0);
      }
      steps = ! steps;
    } else {
      const motion = applyOneMotion(result);
      steps = ! steps;
      if (motion) {
        setTimeout(onStepAll, animationIntervalValue);
      }
    }
  }
  function applyOneMotion(result :Generator<Motion>) :Motion|undefined {
    const next = result.next()
    const motion = next.value;
    if (motion) {
      const panel = hanoi.apply(motion);
      logs.push({motion, panel});
    }
    return motion;
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
