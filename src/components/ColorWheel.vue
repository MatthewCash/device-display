<template>
    <div
        class="color-wheel"
        @click="onColorWheelUpdate"
        @mousemove="onColorWheelUpdate"
        @touchmove="onColorWheelUpdate"
    >
        <div
            class="color-indicator"
            :style="{
                top: colorY + '%',
                left: colorX + '%'
            }"
            :class="{ hidden: !shouldShowIndicator }"
        ></div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { devices, updateDeviceState } from '../devices';

interface HueSaturation {
    hue: number;
    saturation: number;
}

export default defineComponent({
    name: 'ColorWheel',
    setup: () => {
        const colorX = computed(() => {
            if (
                devices.find(device => device.id === 'lights')?.status?.state
                    ?.mode !== 'color'
            )
                return;
            const saturation = Math.floor(
                ((devices.find(device => device.id === 'lights')?.status?.state
                    ?.saturation ?? 0) /
                    100) **
                    2 *
                    100
            );

            const x =
                (Math.sin(
                    ((devices.find(device => device.id === 'lights')?.status
                        ?.state?.hue ?? 0) /
                        180) *
                        Math.PI
                ) *
                    (saturation ?? 0) +
                    100) /
                2;

            return x;
        });

        const colorY = computed(() => {
            if (
                devices.find(device => device.id === 'lights')?.status?.state
                    ?.mode !== 'color'
            )
                return;
            const saturation = Math.floor(
                ((devices.find(device => device.id === 'lights')?.status?.state
                    ?.saturation ?? 0) /
                    100) **
                    2 *
                    100
            );

            const y =
                50 -
                (Math.cos(
                    ((devices.find(device => device.id === 'lights')?.status
                        ?.state?.hue ?? 0) /
                        180) *
                        Math.PI
                ) *
                    (saturation ?? 0)) /
                    2;

            return y;
        });

        const shouldShowIndicator = computed(
            () =>
                devices.find(device => device.id === 'lights')?.status?.state
                    ?.mode === 'color'
        );

        return { colorX, colorY, shouldShowIndicator };
    },
    methods: {
        getHueSaturation(radius: number, x: number, y: number): HueSaturation {
            let hue = 90 - Math.trunc((Math.atan2(y, x) * 180) / Math.PI);
            if (hue < 0) hue += 360;

            let saturation = Math.abs(Math.sqrt(x ** 2 + y ** 2));
            saturation = Math.floor(Math.sqrt(saturation / radius) * 100);

            return { hue, saturation };
        },
        onColorWheelUpdate(event: MouseEvent | TouchEvent) {
            let clientX = 0;
            let clientY = 0;

            if (event.type === 'click') {
                event = event as MouseEvent;
                clientX = event.clientX;

                clientY = event.clientY;
            }

            if (event.type === 'mousemove') {
                event = event as MouseEvent;
                if (!event.buttons) return;

                clientX = event.clientX;
                clientY = event.clientY;
            }

            if (event.type === 'touchmove') {
                event = event as TouchEvent;

                clientX = event.targetTouches[0].clientX;
                clientY = event.targetTouches[0].clientY;
            }

            if (!clientX || !clientY) return;

            const targetDims = (
                event.currentTarget as HTMLElement
            ).getBoundingClientRect();

            const { width, height } = targetDims;

            const x = clientX - targetDims.x - width / 2;
            const y = -clientY + targetDims.y + height / 2;

            if (Math.abs(x) > height / 2) return;
            if (Math.abs(y) > height / 2) return;

            const { hue, saturation } = this.getHueSaturation(height / 2, x, y);

            updateDeviceState('lights', { hue, saturation, power: true });
        }
    }
});
</script>

<style lang="scss" scoped>
.color-wheel {
    background: radial-gradient(white, transparent 60%),
        conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
    width: 300px;
    height: 300px;
    border-radius: 50%;
    position: relative;
}
.color-indicator {
    border-radius: 50%;
    background-color: white;
    border: 1px solid rgb(133, 133, 133);
    width: 10%;
    height: 10%;
    position: absolute;
    transform: translate(-50%, -50%);
}
.color-indicator.hidden {
    background-color: transparent;
    border: none;
}
</style>