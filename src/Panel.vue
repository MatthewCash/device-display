<template>
    <div class="grid-container">
        <div class="grid-item devices"><Devices /></div>
        <div class="grid-item basic"><Lighting /></div>
        <div class="grid-item effects"><Effects /></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Devices from "./sections/Devices.vue";
import Lighting from "./sections/Lighting.vue";
import Effects from "./sections/Effects.vue";

export default defineComponent({
    name: "Panel",
    components: {
        Devices,
        Lighting,
        Effects,
    },
});
</script>

<style lang="scss" scoped>
.grid-container {
    display: grid;
    grid-template-columns: calc(100% / 3) calc(100% / 3) calc(100% / 3);
}
</style>