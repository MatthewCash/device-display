<template>
    <div>
        <div
            class="brightness-slider"
            @click="onBrightnessUpdate"
            @mousemove="onBrightnessUpdate"
            @touchmove="onBrightnessUpdate"
        >
            <div
                class="brightness-indicator"
                :style="{
                    left: currentBrightness + '%',
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
    name: 'BrightnessSlider',
    setup: () => {
        const shouldHideIndicator = computed(() => {
            return (
                devices.find(device => device.id === 'lights')?.status?.state
                    ?.power === false
            );
        });

        const currentBrightness = computed(() => {
            return devices.find(device => device.id === 'lights')?.status?.state
                ?.brightness;
        });

        return { shouldHideIndicator, currentBrightness };
    },
    methods: {
        setBrightness(brightness: number) {
            updateDeviceState('lights', { brightness, power: true });
        },
        onBrightnessUpdate(event: MouseEvent | TouchEvent) {
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

            const brightness = Math.round(
                ((clientX - targetDims.x) / targetDims.width) * 100
            );

            this.setBrightness(brightness);
        }
    }
});
</script>

<style lang="scss" scoped>
.brightness-slider {
    width: 300px;
    height: 20px;
    background: linear-gradient(to right, #000000 0%, #ffffff 100%);
    border-radius: 0 1em 1em 0;
    position: relative;
    padding: 10px;
}
.brightness-indicator {
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.9);
    width: 75px;
    height: 50px;
    position: absolute;
    transform: translate(-35px, -50%);
    overflow: visible;
}
</style>