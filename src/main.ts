import { createApp } from 'vue';
import App from './App.vue';
import * as lightingConnection from './lightingConnection';
import * as deviceConnection from './devicesConnection';

lightingConnection.startWebSocketConnection();
deviceConnection.startWebSocketConnection();

createApp(App).mount('#app');
