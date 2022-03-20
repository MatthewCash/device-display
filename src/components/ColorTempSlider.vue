<template>
    <div>
        <Slider
            :shouldHideIndicator="shouldHideIndicator"
            :currentPosition="normalizedColorTemp"
            @adjust="setColorTemp"
            background="linear-gradient(to right, #ffb459, #b6ceff)"
            borderRadius="1em"
        />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { devices, updateDeviceState } from '../devices';
import Slider from './Slider.vue';

export default defineComponent({
    name: 'ColorTempSlider',
    components: {
        Slider
    },
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
        setColorTemp(normalizedColorTemp: number) {
            const colorTemp = (normalizedColorTemp / 100) * 6500 + 2500;
            updateDeviceState('lights', { colorTemp, power: true });
        }
    }
});
</script>