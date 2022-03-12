<template>
    <div class="lighting">
        <h1 class="lighting-title">Lighting</h1>
        <hr class="lighting-separator" />
        <ColorWheel />
        <div style="margin-top: 50px"></div>
        <BrightnessSlider class="slider"></BrightnessSlider>
        <div style="margin-top: 20px"></div>
        <ColorTempSlider class="slider"></ColorTempSlider>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ColorWheel from '../components/ColorWheel.vue';
import BrightnessSlider from '../components/BrightnessSlider.vue';
import ColorTempSlider from '../components/ColorTempSlider.vue';

export default defineComponent({
    name: 'Lighting',
    components: {
        ColorWheel,
        BrightnessSlider,
        ColorTempSlider
    }
});
</script>

<style lang="scss" scoped>
.lighting {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
}
.lighting-title {
    font-family: monospace;
    margin-bottom: 0;
    font-size: 2.4rem;
}
.lighting-separator {
    width: 80%;
    margin: 10px 0 30px;
}
.slider {
    width: 100%;
}
</style>