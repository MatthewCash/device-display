import { createApp } from 'vue';
import App from './App.vue';
import * as deviceConnection from './devicesConnection';

deviceConnection.startWebSocketConnection();

createApp(App).mount('#app');
