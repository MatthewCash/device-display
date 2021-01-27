<template>
    <div class="info">
        <h1 class="info-title">Info</h1>
        <hr class="info-separator" />
        <div
            class="device-container"
            v-for="device of devices"
            :key="device.id"
            @click="toggleDevice(device)"
        >
            <div
                class="device-status"
                :class="{ 'device-enabled': device.online }"
            >
                {{ device.online ? 'Enabled' : 'Disabled' }}
            </div>
            <div class="device-info">
                <span class="device-name">{{ device.name }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { Device, devices, setDevice } from '../devices';

export default defineComponent({
    name: 'Info',
    setup: () => {
        const sortedDevices = computed(() =>
            devices.sort((a, b) => a.name.localeCompare(b.name))
        );

        return { devices: sortedDevices };
    },
    methods: {
        toggleDevice(device: Device) {
            setDevice(device.id, !device.online);
        }
    }
});
</script>

<style lang="scss" scoped>
.info {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin: 10px 20px;
}
.info-title {
    font-family: monospace;
    margin-bottom: 0;
    font-size: 2.4rem;
}
.info-separator {
    width: 80%;
    margin: 10px 0 30px;
}
.device-container {
    display: grid;
    grid-template-columns: 30% 70%;
    width: 100%;
    text-align: center;
    background-color: rgb(68, 68, 68);
    border-radius: 6px;
    margin-bottom: 15px;
}
.device-container > div {
    width: 100%;
    padding: 20px 0;
}
.device-status {
    background-color: rgb(109, 109, 109);
    border-radius: 6px 0px 0px 6px;
}
.device-enabled {
    background-color: rgb(150, 150, 150);
}
@keyframes device-enabled {
    0% {
        transform: translateX(0px);
    }
    50% {
        transform: translateX(6px);
    }
    100% {
        transform: translateX(0px);
    }
}
.device-info {
    font-family: monospace;
    font-size: 1.3rem;
}
</style>