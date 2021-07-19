<template>
  <main>
    <div class="ops">
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

main {
  margin: 1rem;
  text-align: center;
  display: grid;
}

@media screen and (min-width: 960px) {
  main {
    grid-template-columns: 60% 1fr;
    display: grid;
    gap: 1rem;
  }
}

.ops {
  display: grid;
  height: fit-content;
  grid-template-rows: auto;
  gap: 2rem;
}
</style>
