<template>
    <div class="effects">
        <h1 class="effects-title" @click="reloadEffects()">Effects</h1>
        <hr class="effects-separator" />
        <div class="effects-list">
            <h3 v-show="lightingEffects.length === 0">No Effects Configured</h3>
            <div
                class="effect-container"
                v-for="effect of lightingEffects"
                :key="effect.id"
                @click="toggleEffect(effect)"
            >
                <div
                    class="effect-status"
                    :class="{ 'effect-enabled': effectIsEnabled(effect) }"
                >
                    {{ effectIsEnabled(effect) ? 'Enabled' : 'Disabled' }}
                </div>
                <div class="effect-info">
                    <span class="effect-name">{{ effect.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { devices, updateDeviceState } from '../devices';
import { LightingEffect, lightingEffects, reloadEffects } from '../effects';

export default defineComponent({
    name: 'Effects',
    setup: () => {
        return { lightingEffects, status };
    },
    methods: {
        effectIsEnabled(effect: LightingEffect) {
            return (
                devices.find(device => device.id === 'lights')?.status.state
                    .effectId === effect.id
            );
        },
        toggleEffect(effect: LightingEffect) {
            if (this.effectIsEnabled(effect)) {
                updateDeviceState('lights', { effectId: null });
            } else {
                updateDeviceState('lights', { effectId: effect.id });
            }
        },
        reloadEffects() {
            reloadEffects();
        }
    }
});
</script>

<style lang="scss" scoped>
.effects {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin: 10px 20px;
}
.effects-title {
    font-family: monospace;
    margin-bottom: 0;
    font-size: 2.4rem;
}
.effects-separator {
    width: 80%;
    margin: 10px 0 30px;
}
.effects-list {
    width: 100%;
}

.effect-container {
    display: grid;
    grid-template-columns: 40% 60%;
    text-align: center;
    background-color: rgb(68, 68, 68);
    border-radius: 6px;
    margin-bottom: 20px;
}
.effect-container > div {
    padding: 35px 0;
}
.effect-status {
    background-color: rgb(88, 88, 88);
    border-radius: 6px 0px 0px 6px;
    font-size: 1.2rem;
}
.effect-enabled {
    background-color: rgb(150, 150, 150);
    animation: 1s infinite effect-enabled;
}
@keyframes effect-enabled {
    0% {
        transform: translateX(0px);
    }
    50% {
        transform: translateX(6px);
    }
    100% {
        transform: translateX(0px);
    }
}
.effect-info {
    font-family: monospace;
    font-size: 1.3rem;
}
</style>