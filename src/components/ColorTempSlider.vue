<template>
    <div>
        <div
            class="colortemp-slider"
            @click="onColorTempUpdate"
            @mousemove="onColorTempUpdate"
            @touchmove="onColorTempUpdate"
        >
            <div
                class="colortemp-indicator"
                :style="{
                    left: normalizedColorTemp + '%',
                    visibility: shouldHideIndicator ? 'hidden' : 'visible'
                }"
            ></div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { devices, updateDeviceState } from '../devices';

export default defineComponent({
    name: 'ColorTempSlider',
    setup: () => {
        const shouldHideIndicator = computed(() => {
            return (
                devices.find(device => device.id === 'lights')?.status?.state
                    ?.colorTemp === 0
            );
        });

        const normalizedColorTemp = computed(() => {
            return Math.round(
                ((devices.find(device => device.id === 'lights')?.status?.state
                    ?.colorTemp || 2500) -
                    2500) /
                    65
            );
        });

        return { normalizedColorTemp, shouldHideIndicator };
    },
    methods: {
        setColorTemp(colorTemp: number) {
            updateDeviceState('lights', { colorTemp });
        },
        onColorTempUpdate(event: MouseEvent | TouchEvent) {
            let clientX = 0;

            if (event.type === 'click') {
                event = event as MouseEvent;
                clientX = event.clientX;
            }

            if (event.type === 'mousemove') {
                event = event as MouseEvent;
                if (!event.buttons) return;
                clientX = event.clientX;
            }

            if (event.type === 'touchmove') {
                event = event as TouchEvent;
                clientX = event.targetTouches[0].clientX;
            }

            if (!clientX) return;

            const targetDims = (
                event.currentTarget as HTMLElement
            ).getBoundingClientRect();

            const x = -clientX + targetDims.x + targetDims.width / 2;

            if (Math.abs(x) > targetDims.width / 2) return;

            const colorTemp = Math.round(
                ((clientX - targetDims.x) / targetDims.width) * 6500 + 2500
            );

            this.setColorTemp(colorTemp);
        }
    }
});
</script>

<style lang="scss" scoped>
.colortemp-slider {
    width: 300px;
    height: 20px;
    background: linear-gradient(to right, #ffb459, #b6ceff);
    border-radius: 1em;
    position: relative;
    padding: 10px;
}
.colortemp-indicator {
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.9);
    width: 75px;
    height: 50px;
    position: absolute;
    transform: translate(-35px, -50%);
    overflow: visible;
}
</style>