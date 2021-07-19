<template>
    <div id="root" ref="root"></div>
</template>
  
  <script setup lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import sqlFormatter from '@sqltools/formatter';
import debounce from 'lodash.debounce';
import * as monaco from 'monaco-editor-core'
import 'monaco-languages/release/esm/sql/sql.contribution'
// @ts-ignore
import EditorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker'
import { socket } from "./socket";

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
    monaco.languages.registerDocumentFormattingEditProvider("sql", {
        async provideDocumentFormattingEdits(model) {
            const formatted = await sqlFormatter.format(model.getValue(), {
                reservedWordCase: 'upper'
            });
            return [
                {
                    range: model.getFullModelRange(),
                    text: formatted,
                },
            ];
        }
    });

    editor = monaco.editor.create(root.value!, {
        language: 'sql',
        value: `SELECT 1 + 1;`,
        automaticLayout: true,
        formatOnType: true,
        formatOnPaste: true,
    })


    editor.getModel()?.onDidChangeContent(debounce((e) => {
        socket.send({
            type: 'query',
            payload: editor.getValue()
        })
        setTimeout(() => { editor.trigger('anyString', 'editor.action.formatDocument', undefined); });
    }, 500))

})

onUnmounted(() => {
    editor.dispose()
})
</script>
  
<style scoped>
#root {
    text-align: left;
    height: 20vh;
}
</style>