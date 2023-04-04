<template>
    <div class="devices-section">
        <div class="scenes-container">
            <div
                class="scene"
                v-for="(name, id) of scenes"
                :key="id"
                @click.prevent="runScene(id)"
                @touchstart.prevent="runScene(id)"
            >
                <span class="scene-name">{{ name }}</span>
            </div>
        </div>
        <h3 v-show="devices.length === 0">No Devices Detected</h3>
        <div class="devices">
            <div
                class="device-container"
                v-for="device of devices"
                :key="device.id"
                @click.prevent="toggleDevice(device)"
                @touchstart.prevent="toggleDevice(device)"
            >
                <div
                    class="device-status"
                    :class="{ 'device-enabled': device?.status?.state?.power }"
                >
                    <div v-show="device.loading" class="loading">
                        <div class="spinner"></div>
                    </div>
                    <span v-show="!device.loading">{{
                        device?.status?.state?.power ? 'On' : 'Off'
                    }}</span>
                </div>
                <div class="device-info">
                    <span class="device-name">{{ device.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { Device, devices, updateDeviceState } from '../devices';
import { sendMessage } from '../devicesConnection';

const scenes = {
    on: 'On',
    off: 'Off'
};

export default defineComponent({
    name: 'devices',
    setup: () => {
        const sortedDevices = computed(() =>
            devices
                .filter(device => device.capabilities?.includes('bool-switch'))
                .sort((a, b) => a.name.localeCompare(b.name))
        );

        return { devices: sortedDevices, scenes };
    },
    methods: {
        toggleDevice(device: Device) {
            const currentPower = device?.status?.state?.power;
            updateDeviceState(device.id, { power: !currentPower });
        },
        runScene(sceneId: string) {
            sendMessage({
                commands: {
                    setScene: sceneId
                }
            });
        }
    }
});
</script>

<style lang="scss" scoped>
.scenes-container {
    display: flex;
    margin: 20px 0px 0px 20px;
}
.scene {
    width: 100%;
    text-align: center;
    background-color: rgb(68, 68, 68);
    background: linear-gradient(
        to right,
        rgb(150, 150, 150) 10%,
        rgb(68, 68, 68) 10%,
        rgb(68, 68, 68) 100%
    );
    border-radius: 6px;
    padding: 35px;
    margin: 0px 20px 0px 0px;
}
.scene-name {
    font-size: 1.335rem;
}
.devices-section {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.devices {
    display: flex;
    flex-direction: column;
    margin: 0px 20px 5px 20px;
}
.devices-title {
    font-family: monospace;
    margin-bottom: 0;
    font-size: 2.4rem;
}
.device-container {
    display: grid;
    grid-template-columns: 25% 75%;
    width: 100%;
    text-align: center;
    background-color: rgb(68, 68, 68);
    border-radius: 6px;
    margin-bottom: 20px;
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
</style>
