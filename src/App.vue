<template>
    <Panel />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Panel from './Panel.vue';

export default defineComponent({
    name: 'App',
    components: {
        Panel
    }
});
</script>

<style>
html {
    font-size: 20px;
    overflow: hidden;
    cursor: none;
    touch-action: none;
}
body {
    margin: 0;
    overscroll-behavior: none;
}
* {
    box-sizing: border-box;
    user-select: none;
}
#app * {
    transition: all 0.3s;
}
#app {
    font-family: sans-serif;
    color: white;
    background-color: black;
    width: 100vw;
    height: 100vh;
}
</style>
