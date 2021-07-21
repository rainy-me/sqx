<template>
    <pre class="error">{{ queryResult.error }}</pre>
    <Table :data="data" />
</template>
<script setup lang="ts">
import { computed, watch } from 'vue';
import type { Result } from 'sqx/shared';
import { ref, defineProps, reactive } from 'vue'
import { queryResult } from './socket'
import { extractData } from './utils'
import Table from './Table.vue'

const data = computed(() => extractData(queryResult.value))
</script>

<style scoped>
.error {
    margin: 0 0;
    color: #ec407a;
    text-shadow: 0 0 5px #000;
    font-size: 1rem;
    font-weight: bold;
    word-break: break-all;
    white-space: pre-line;
    text-align: left;
    word-wrap: break-word;
}

table {
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
  