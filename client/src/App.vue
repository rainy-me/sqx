<template>
  <main>
    <div class="ops">
      <h1>
        <span>SQX</span>
        <span class="dot">.</span>
      </h1>
      <Info />
      <Editor />
      <QueryResult />
    </div>
    <SampleResult />
  </main>
</template>
<script setup lang="ts">
import { watch } from 'vue';
import { ref, onMounted } from 'vue'
import Info from './Info.vue'
import Editor from './Editor.vue'
import QueryResult from './QueryResult.vue'
import SampleResult from './SampleResult.vue'
</script>
<style>
h1 {
  padding: 0;
  margin: 0;
  color: var(--sqx-text);
  text-align: left;
}

.dot {
  color: var(--sqx-accent);
}

main {
  margin: 1rem;
  text-align: center;
  display: grid;
}

@media screen and (min-width: 960px) {
  main {
    grid-template-columns: 60% minmax(0, 1fr);
    display: grid;
    gap: 1rem;
  }
}

.ops {
  display: grid;
  height: fit-content;
  grid-template-rows: auto;
  gap: 1rem;
}
</style>
