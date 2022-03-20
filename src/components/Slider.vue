<template>
    <div>
        <div
            class="slider-hitbox"
            @click="onSliderAdjust"
            @mousemove="onSliderAdjust"
            @touchmove="onSliderAdjust"
        >
            <div
                class="slider"
                ref="slider"
                :style="{ background, borderRadius }"
            >
                <div
                    class="indicator"
                    :style="{
                        left: currentPosition + '%',
                        visibility: shouldHideIndicator ? 'hidden' : 'visible'
                    }"
                ></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Slider',
    props: {
        shouldHideIndicator: {
            type: Boolean,
            default: false
        },
        currentPosition: {
            type: Number,
            default: 0
        },
        background: {
            type: String
        },
        borderRadius: {
            type: String
        }
    },
    emits: {
        adjust: null
    },
    setup: () => {},
    methods: {
        onSliderAdjust(event: MouseEvent | TouchEvent) {
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
                this.$refs.slider as HTMLElement
            ).getBoundingClientRect();

            const sliderAmount = Math.round(
                ((clientX - targetDims.x) / targetDims.width) * 100
            );

            this.$emit('adjust', sliderAmount);
        }
    }
});
</script>

<style lang="scss" scoped>
.slider-hitbox {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.slider {
    width: 300px;
    height: 20px;
    background: linear-gradient(to right, #000000 0%, #ffffff 100%);
    border-radius: 1em;
    position: relative;
    padding: 10px;
}
.indicator {
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.9);
    width: 75px;
    height: 50px;
    position: absolute;
    transform: translate(-35px, -50%);
    overflow: visible;
}
</style>