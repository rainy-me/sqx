<template>
    <div class="sample">
        <div class="sample-table" v-for="sample in samples">
            <h2 class="sample-table-name">{{ sample.fields?.[0]?.table }}</h2>
            <Table :data="sample" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue';
import type { Result } from 'sqx/shared';
import { ref, defineProps, reactive } from 'vue'
import { sampleResult } from './socket'
import { extractData } from './utils'
import Table from './Table.vue'

const samples = computed(() => sampleResult.value.map(extractData))
</script>

<style scoped>
.sample {
    display: grid;
    width: inherit;
}

.sample-table {
    overflow: scroll;
}

.sample-table + .sample-table {
    margin-top: 2rem;
}
.sample-table-name {
    text-align: left;
}
</style>
  