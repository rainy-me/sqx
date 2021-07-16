<template>  
  
  
  
  
  <input class="url" type="text" v-model="databaeURL" />
  <Editor />
  <QueryResult />




</template>
<script setup lang="ts">
import { watch } from 'vue';
import { ref, onMounted } from 'vue'
import Editor from './Editor.vue'
import QueryResult from './QueryResult.vue'
import { socket } from './socket'
const databaeURL = ref('mysql://root:root@localhost/development');
const updateConfig = () => socket.send({
  type: 'config',
  payload: databaeURL.value
})

watch(databaeURL, () => {
  updateConfig()
})
socket.ready(() => {
  updateConfig()
})


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
.url {
  width: 80vw;
  text-align: left;
  font-size: 1.4rem;
  border: none;
  appearance: none;
  margin-bottom: 3rem;
}

.url:focus {
  border: none;
  appearance: none;
}
</style>
