<template>
    <h2 v-show="!connected" class="disconnected-alert">
        Disconnected from <br />Device Controller
    </h2>
    <div class="grid-container sections" :class="{ disconnected: !connected }">
        <div class="grid-item devices"><Devices /></div>
        <div class="grid-item basic"><Lighting /></div>
        <div class="grid-item effects"><Effects /></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Devices from './sections/Devices.vue';
import Lighting from './sections/Lighting.vue';
import Effects from './sections/Effects.vue';
import { connected } from './devicesConnection';

export default defineComponent({
    name: 'Panel',
    setup: () => {
        return { connected };
    },
    components: {
        Devices,
        Lighting,
        Effects
    }
});
</script>

<style lang="scss">
.grid-container {
    display: grid;
    grid-template-columns: calc(100% / 3) calc(100% / 3) calc(100% / 3);
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

@keyframes loading {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.spinner,
.spinner:after {
    border-radius: 50%;
    width: 10em;
    height: 10em;
}
.spinner {
    bottom: 23.4px;
    font-size: 6px;
    position: absolute;
    text-indent: -9999em;
    border-top: 1.1em solid rgba(255, 255, 255, 0.2);
    border-right: 1.1em solid rgba(255, 255, 255, 0.2);
    border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
    border-left: 1.1em solid #ffffff;
    transform: translateZ(0);
    animation: loading 0.5s infinite linear;
}

.sections {
    transition: 2s filter;
}

.sections.disconnected {
    filter: blur(20px) brightness(0.3);
}

.disconnected-alert {
    color: red;
    font-size: 3.5rem;
    font-weight: bold;
    animation: pulse 2s infinite;
    text-shadow: 0.05rem 0.05rem white;
    position: absolute;
    display: block;
    top: 2.5em;
    z-index: 100;
    text-align: center;
    width: 100%;
}
</style>
