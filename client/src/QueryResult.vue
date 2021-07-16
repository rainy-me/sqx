<template>
    <pre class="error">{{ queryResult.error }}</pre>
    <table>
        <thead v-if="table.fields">
            <th v-for="field in table.fields" :key="field">{{ field }}</th>
        </thead>
        <tbody v-if="table.results">
            <tr v-for="(_,i) in table.fields" :key="`row-${i}`">
                <td v-for="cell in table.results[i]" :key="`cell-${i}`">{{ cell ?? "null" }}</td>
            </tr>
        </tbody>
    </table>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue';
import type { Result } from 'sqx/shared';
import { ref, defineProps, reactive } from 'vue'
import { queryResult } from './socket'

const table = computed(() => {
    return {
        fields: queryResult.value.data?.fields.map((f: any) => f.name),
        results: queryResult.value.data?.results,
    }
})
</script>

<style scoped>
.error {
    margin: 0 0;
    width: 80vw;
    color: red;
    word-break: break-all;
    white-space: pre-line;
    text-align: left;
    word-wrap: break-word;
}

table {
    width: 80vw;
    margin: 0 0;
    border-collapse: collapse;
    border: 1px solid #000;
}
tr:nth-child(2n + 1) {
    border-collapse: collapse;
    background-color: #eee;
}
th,
td {
    padding: 5px;
    border: 1px solid #000;
    border-collapse: collapse;
}
</style>
  