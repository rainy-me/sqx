<template>
    <input class="url" type="text" v-model="databaeURL" />
    <div class="config">
        <template v-for="field in ['protocol','user','hosts','path']" :key="field">
            <span class="config-name">{{ field }}</span>
            <span>{{ config?.[field] }}</span>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { ref } from 'vue'
import { ConnectionString } from "connection-string";
import { socket } from './socket'
const databaeURL = ref('mysql://root:root@localhost/development');
const updateConfig = () => socket.send({
    type: 'config',
    payload: databaeURL.value
})

const config = computed(() => new ConnectionString(databaeURL.value))

watch(databaeURL, () => {
    updateConfig()
})

socket.ready(() => {
    updateConfig()
})
</script>

<style>
.url {
    width: 100%;
    text-align: left;
    font-size: 1.4rem;
    border: none;
    appearance: none;
}

.url:focus {
    border: none;
    appearance: none;
}
.config-name {
    font-weight: bold;
}
.config {
    display: grid;
    text-align: left;
    grid-template-columns: 1fr 2fr 1fr 2fr;
}
</style>
