<template>
    <div class="basic">
        <h1 class="basic-title">Lighting</h1>
        <hr class="basic-separator" />
        <!-- <div
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
        </div> -->
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { status } from '../status';

export default defineComponent({
    name: 'Lighting',
    setup: () => {
        return {};
    },
    methods: {}
});
</script>

<style lang="scss" scoped>
.basic {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin: 10px 20px;
}
.basic-title {
    font-family: monospace;
    margin-bottom: 0;
    font-size: 2.4rem;
}
.basic-separator {
    width: 80%;
    margin: 10px 0 30px;
}
// .effect-container {
//     display: grid;
//     grid-template-columns: 30% 70%;
//     width: 100%;
//     text-align: center;
//     background-color: rgb(68, 68, 68);
//     border-radius: 6px;
//     margin-bottom: 15px;
// }
// .effect-container > div {
//     width: 100%;
//     padding: 20px 0;
// }
// .effect-status {
//     background-color: rgb(109, 109, 109);
//     border-radius: 6px 0px 0px 6px;
// }
// .effect-enabled {
//     background-color: rgb(150, 150, 150);
//     animation: 1s infinite effect-enabled;
// }
// @keyframes effect-enabled {
//     0% {
//         transform: translateX(0px);
//     }
//     50% {
//         transform: translateX(6px);
//     }
//     100% {
//         transform: translateX(0px);
//     }
// }
// .effect-info {
//     font-family: monospace;
//     font-size: 1.3rem;
// }
</style>