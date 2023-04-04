import { createApp } from 'vue';
import App from './App.vue';
import * as deviceConnection from './devicesConnection';

createApp(App).mount('#app');

window.addEventListener('load', deviceConnection.startWebSocketConnection);
