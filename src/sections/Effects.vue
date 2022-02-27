<template>
    <div class="effects">
        <h1 class="effects-title" @click="reloadEffects()">Effects</h1>
        <hr class="effects-separator" />
        <h2 v-show="!connected" class="disconnected-alert">
            Disconnected from Lighting Controller
        </h2>
        <div class="effects-list" :class="{ disconnected: !connected }">
            <h3 v-show="connected && lightingEffects.length === 0">
                No Effects Configured
            </h3>
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
import { LightingEffect, lightingEffects, reloadEffects } from '../effects';
import { status } from '../status';
import { sendMessage, connected } from '../lightingConnection';

export default defineComponent({
    name: 'Effects',
    setup: () => {
        return { lightingEffects, status, connected };
    },
    methods: {
        effectIsEnabled(effect: LightingEffect) {
            return this.status?.effect?.id === effect.id;
        },
        toggleEffect(effect: LightingEffect) {
            if (this.effectIsEnabled(effect)) {
                sendMessage({ setEffect: null });
            } else {
                sendMessage({ setEffect: effect.id });
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
.effects-list.disconnected {
    filter: blur(3px) brightness(0.3);
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

.disconnected-alert {
    color: red;
    font-size: 2rem;
    animation: pulse 2s infinite;
    text-shadow: 0.05rem 0.05rem white;
    position: absolute;
    display: block;
    top: 2.5em;
    z-index: 100;
}
</style>