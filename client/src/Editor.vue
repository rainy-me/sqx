<template>
    <div id="root" ref="root"></div>
</template>
  
  <script setup lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from "vue";
import sqlFormatter from '@sqltools/formatter';
import debounce from 'lodash.debounce';
import * as monaco from 'monaco-editor-core'
import 'monaco-languages/release/esm/sql/sql.contribution'
// @ts-ignore
import EditorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker'
import { socket, sampleResult } from "./socket";
import { RESERVED_KEYWORDS } from "./ReservedKeywords";

const completes = computed<monaco.languages.CompletionItem[]>(() => {
    const kind = monaco.languages.CompletionItemKind.Constant;
    return sampleResult.value.flatMap((table) => {
        const tableName = table.data.fields?.[0].table;
        return [{
            label: `t:${tableName}`,
            kind,
            insertText: tableName,
        }, ...table.data.fields.flatMap(f => ({
            label: `c:${f.name} of ${tableName}`,
            kind,
            insertText: f.name
        }))]
    })
})

type Range = {
    startLineNumber: number
    endLineNumber: number
    startColumn: number
    endColumn: number
}
function createSuggestions(range: Range): monaco.languages.CompletionItem[] {
    return [...completes.value, ...RESERVED_KEYWORDS,].map(v => ({ ...v, range }))
}

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

    monaco.languages.registerCompletionItemProvider('sql', {
        provideCompletionItems(model, position) {
            // find out if we are completing a property in the 'dependencies' object.
            const textUntilPosition = model.getValueInRange({ startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column });
            const word = model.getWordUntilPosition(position);
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn
            };
            return {
                suggestions: createSuggestions(range)
            };
        }
    });

    editor = monaco.editor.create(root.value!, {
        language: 'sql',
        value: `SELECT 1 + 1;`,
        automaticLayout: true,
        formatOnType: true,
        formatOnPaste: true,
    })

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
        editor.trigger('anyString', 'editor.action.formatDocument', undefined);
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
    width: 100%;
    text-align: left;
    height: 20vh;
}
</style>