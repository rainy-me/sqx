<template>
    <section>
        <p class="url">
            Database URL:
            <input class="url-input" type="text" v-model="databaeURL" />
        </p>
        <div class="config">
            <template v-for="field in ['user', 'protocol']" :key="field">
                <span class="config-name">{{ field }}</span>
                <span>{{ config?.[field] }}</span>
            </template>
            <span class="config-name">database</span>
            <span>{{ config.path?.[0] }}</span>
            <span class="config-name">host ({{ config.hosts?.[0].type }})</span>
            <span>{{ config.hosts?.[0].name }}</span>
        </div>
    </section>
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
    display: grid;
    grid-template-columns: auto 1fr;
    place-items: center;
    gap: 1rem;
    font-size: 1.4rem;
    font-weight: bold;
}
.url-input {
    transition: 0.3s all ease-in-out;
    width: 100%;
    text-align: left;
    font-size: inherit;
    border: none;
    border-bottom: 2px solid transparent;
    background-color: transparent;
    appearance: none;
    outline: none;
    color: var(--sqx-text);
}

.url-input:focus {
    border: none;
    border-bottom: 1px solid aquamarine;
}
.config-name {
    font-weight: bold;
}
.config {
    display: grid;
    text-align: left;
    grid-template-columns: 1fr 2fr 1fr 2fr;
    margin-bottom: 1rem;
}
</style>
