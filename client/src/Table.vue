<template>
    <table>
        <thead v-if="data.fields">
            <th v-for="field in data.fields" :key="field">{{ field.name }}</th>
        </thead>
        <tbody v-if="data.results">
            <tr v-for="(row,i) in data.results" :key="`row-${i}`">
                <td v-for="cell in row" :key="`cell-${i}`">{{ cell ?? "null" }}</td>
            </tr>
        </tbody>
    </table>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue';
import type { Result } from 'sqx/shared';
import { ref, defineProps, reactive } from 'vue'

const props = defineProps<{
    data: {
        fields: string[],
        results: any[][]
    }
}>()

</script>

<style scoped>
.error {
    margin: 0 0;
    width: 100%;
    color: red;
    word-break: break-all;
    white-space: pre-line;
    text-align: left;
    word-wrap: break-word;
}

table {
    width: 100%;
    overflow: scroll;
    margin: 0 0;
    border-collapse: collapse;
    border: 1px solid #000;
}
tr:nth-child(2n + 1) {
    border-collapse: collapse;
    background-color: rgb(0 0 0 / 0.3);
}

th {
    background-color: var(--sqx-accent);
    color: #000;
}

th,
td {
    padding: 10px;
    border: 1px solid #000;
    border-collapse: collapse;
}
</style>
  