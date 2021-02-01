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
                top: colorY + 'px',
                left: colorX + 'px'
            }"
            :class="{ hidden: !shouldShowIndicator }"
        ></div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { sendMessage } from '../lightingConnection';
import { status } from '../status';

interface HueSaturation {
    hue: number;
    saturation: number;
}

export default defineComponent({
    name: 'ColorWheel',
    setup: () => {
        const colorX = computed(() => {
            const saturation = Math.floor(
                ((status.saturation ?? 0) / 100) ** 2 * 100
            );

            const x =
                Math.sin(((status.hue ?? 0) / 180) * Math.PI) *
                    (saturation ?? 0) +
                100;

            return x;
        });

        const colorY = computed(() => {
            const saturation = Math.floor(
                ((status.saturation ?? 0) / 100) ** 2 * 100
            );

            const y =
                100 -
                Math.cos(((status.hue ?? 0) / 180) * Math.PI) *
                    (saturation ?? 0);

            return y;
        });

        const shouldShowIndicator = computed(() => status.mode === 'color');

        return { colorX, colorY, shouldShowIndicator };
    },
    methods: {
        getHueSaturation(x: number, y: number): HueSaturation {
            let hue = 90 - Math.trunc((Math.atan2(y, x) * 180) / Math.PI);
            if (hue < 0) hue += 360;

            let saturation = Math.abs(Math.sqrt(x ** 2 + y ** 2));
            saturation = Math.floor(Math.sqrt(saturation / 100) * 100);

            return { hue, saturation };
        },
        onColorWheelUpdate(event: MouseEvent | TouchEvent) {
            let clientX: number = 0;
            let clientY: number = 0;

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

            const targetDims = (event.currentTarget as HTMLElement).getBoundingClientRect();

            const x = clientX - targetDims.x - 100;
            const y = -clientY + targetDims.y + 100;

            const { hue, saturation } = this.getHueSaturation(x, y);

            sendMessage({
                setHueSaturation: { hue, saturation }
            });
        }
    }
});
</script>

<style lang="scss" scoped>
.color-wheel {
    background: radial-gradient(white, transparent 60%),
        conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
    width: 200px;
    height: 200px;
    border-radius: 50%;
    position: relative;
}
.color-indicator {
    border-radius: 50%;
    background-color: white;
    width: 20px;
    height: 20px;
    position: absolute;
    transform: translate(-10px, -10px);
}
.color-indicator.hidden {
    background-color: transparent;
}
</style>