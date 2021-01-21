<template>
    <div class="grid-container">
        <div class="grid-item devices">Devices</div>
        <div class="grid-item basic"><Lighting /></div>
        <div class="grid-item effects"><Effects /></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Effects from './Effects.vue';
import Lighting from './Lighting.vue';

export default defineComponent({
    name: 'Panel',
    components: {
        Effects,
        Lighting
    }
});
</script>

<style lang="scss" scoped>
.grid-container {
    display: grid;
    grid-template-columns: calc(100% / 3) calc(100% / 3) calc(100% / 3);
}
</style>