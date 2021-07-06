import { computed, ref } from 'vue';
import { loadDevices, DeviceUpdate, updateDevice } from './devices';

let ws: WebSocket;
let readyState = ref(0);

export const connected = computed(() => readyState.value === 1);

const connect = () => {
    console.log('Devices Connecting to WS Server...');

    if (ws) ws.close();
    ws = new WebSocket(import.meta.env.VITE_DEVICES_WS_URL as string);
    readyState.value = ws.readyState;

    ws.addEventListener('open', onConnect);
    ws.addEventListener('message', onMessage);
    ws.addEventListener('error', onError);
    ws.addEventListener('close', onClose);
};

const onConnect = () => {
    readyState.value = ws.readyState;
    console.log('Devices WebSocket Connected!');
};

const onMessage = (message: MessageEvent) => {
    let data;
    try {
        data = JSON.parse(message?.data);
    } catch {
        return ws.send('Invalid JSON!');
    }

    if (data['deviceList']) {
        loadDevices(data['deviceList']);
    }
    if (data['deviceUpdate']) {
        const update = data['deviceUpdate'] as DeviceUpdate;

        updateDevice(update.id, update.status);
    }
};

const onError = (error: Event) => {
    console.warn(error);
};

const onClose = () => {
    readyState.value = ws.readyState;
    console.log('Devices WebSocket Disconnected!');
};

export const startWebSocketConnection = () => {
    connect();
    setInterval(() => {
        if (connected.value) return;
        connect();
    }, 3000);
};

export const sendMessage = (data: any) => {
    ws.send(JSON.stringify(data));
};
