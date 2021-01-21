import { createApp } from 'vue';
import App from './App.vue';
import { startWebSocketConnection } from './lightingConnection';

startWebSocketConnection();

createApp(App).mount('#app');
