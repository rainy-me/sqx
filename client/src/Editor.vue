<template>
    <div id="root" ref="root"></div>
</template>
  
  <script setup lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { socket } from "./socket";
import * as monaco from 'monaco-editor'
// @ts-ignore
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// // @ts-ignore
// import SqlWorker from 'monaco-editor/esm/vs/basic-languages/sql/sql.worker?worker'

// @ts-ignore
self.MonacoEnvironment = {
    getWorker(_: string, label: string) {
        // if (label === 'sql') {
        //     return new SqlWorker()
        // }
        return new EditorWorker()
    }
}

const root = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor

onMounted(() => {
    editor = monaco.editor.create(root.value as HTMLElement, {
        language: 'sql',
        value: `select 1+1;`
    })
    editor.getModel()?.onDidChangeContent((e) => {
        socket.send({
            type: 'query',
            payload: editor.getValue()
        })
    })
})

onUnmounted(() => {
    editor.dispose()
})
</script>
  
<style scoped>
#root {
    text-align: left;
    width: 100vw;
    height: 30vh;
}
</style>