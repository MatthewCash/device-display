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
                    :class="{
                        'effect-enabled': enabledLightningEffect === effect.id
                    }"
                >
                    {{
                        enabledLightningEffect === effect.id
                            ? 'Enabled'
                            : 'Disabled'
                    }}
                </div>
                <div class="effect-info">
                    <span class="effect-name">{{ effect.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { devices, updateDeviceState } from '../devices';
import { LightingEffect, lightingEffects, reloadEffects } from '../effects';

export default defineComponent({
    name: 'Effects',
    setup: () => {
        const enabledLightningEffect = computed<string>(() => {
            return devices.find(device => device.id === 'lights')?.status.state
                .effectId;
        });

        return { lightingEffects, enabledLightningEffect, reloadEffects };
    },
    methods: {
        toggleEffect(effect: LightingEffect) {
            updateDeviceState('lights', {
                effectId:
                    this.enabledLightningEffect === effect.id ? null : effect.id
            });
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
