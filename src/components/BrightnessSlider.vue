<template>
    <div>
        <Slider
            :shouldHideIndicator="shouldHideIndicator"
            :currentPosition="currentBrightness"
            @adjust="setBrightness"
            background="linear-gradient(to right, #000000 0%, #ffffff 100%)"
            borderRadius="0 1em 1em 0"
        />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { devices, updateDeviceState } from '../devices';
import Slider from './Slider.vue';

export default defineComponent({
    name: 'BrightnessSlider',
    components: {
        Slider
    },
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
        }
    }
});
</script>
