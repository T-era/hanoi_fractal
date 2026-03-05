<script lang="ts">
  import Controller from './lib/parts/Controller.svelte';
  import { A, B, C, Hanoi, resolve, type Motion } from './lib/Hanoi';
  import Towers from './lib/panels/towers/Towers.svelte';
  import Logs from './lib/panels/Logs.svelte';
  import Tab from './lib/parts/Tab.svelte';
  import type { LogItem } from './lib/HanoiLog';
  import Graphs from './lib/panels/Graphs.svelte';
  import { animationInterval, automation, manual } from './lib/stores/SettingStore';

  let logs :LogItem[] = []
  let hanoi = new Hanoi(0);
  let result :Motion[] | null = null;
  let steps = false;
  let currentCnt = 3;
  let animationIntervalValue = 0.05;

  animationInterval.subscribe((newValue) => {
    animationIntervalValue = newValue;
  });
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
          setTimeout(onStepAll, animationIntervalValue*1000);
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
  <Controller cnt={currentCnt} onStep={onStep} onStepAll={onStepAll} onStart={onStart}/>
</header>
<main>
  <Tab labels={["Towers", "Log", "Graph"]}>
    <div class="tab" slot="a">
      {#key [steps]}
        <Towers a={hanoi.a} b={hanoi.b} c={hanoi.c} />
      {/key}
    </div>
    <div class="tab" slot="b">
      {#key {steps}}
        <Logs logs={logs} />
      {/key}
    </div>
    <div class="tab" slot="c">
      {#key [steps]}
        <Graphs logs={logs} />
      {/key}
    </div>
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
