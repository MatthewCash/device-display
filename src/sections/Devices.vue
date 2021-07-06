<template>
    <div class="devices">
        <h1 class="devices-title">Devices</h1>
        <hr class="devices-separator" />
        <h2 v-if="!connected" class="disconnected">
            Disconnected from Device Controller
        </h2>
        <h3 v-if="connected && devices.length === 0">No Devices Detected</h3>
        <div
            class="device-container"
            v-for="device of devices"
            :key="device.id"
            @click="toggleDevice(device)"
        >
            <div
                class="device-status"
                :class="{ 'device-enabled': device.status }"
            >
                <div class="loading">
                    <div class="spinner"></div>
                </div>
                <span v-show="!device.loading">{{
                    device.status ? 'On' : 'Off'
                }}</span>
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
import { connected } from '../devicesConnection';

export default defineComponent({
    name: 'devices',
    setup: () => {
        const sortedDevices = computed(() =>
            devices.sort((a, b) => a.name.localeCompare(b.name))
        );

        return { devices: sortedDevices, connected };
    },
    methods: {
        toggleDevice(device: Device) {
            setDevice(device.id, !device.status);
        }
    }
});
</script>

<style lang="scss" scoped>
.devices {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin: 10px 20px;
}
.devices-title {
    font-family: monospace;
    margin-bottom: 0;
    font-size: 2.4rem;
}
.devices-separator {
    width: 80%;
    margin: 10px 0 30px;
}
.device-container {
    display: grid;
    grid-template-columns: 25% 75%;
    width: 100%;
    text-align: center;
    background-color: rgb(68, 68, 68);
    border-radius: 6px;
    margin-bottom: 15px;
}
.device-container > div {
    width: 100%;
    padding: 35px 0;
}
.device-status {
    position: relative;
    background-color: rgb(88, 88, 88);
    border-radius: 6px 0px 0px 6px;
    font-size: 1.2rem;
}

.device-enabled {
    background-color: rgb(150, 150, 150);
}
.loading {
    display: flex;
    justify-content: center;
    align-items: center;
}
.device-info {
    font-family: monospace;
    font-size: 1.3rem;
}

.disconnected {
    color: red;
    animation: pulse 2s infinite;
}
</style>