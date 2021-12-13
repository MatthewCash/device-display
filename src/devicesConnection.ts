import { computed, ref } from 'vue';
import { loadDevices, DeviceUpdate, updateDevice } from './devices';

let ws: WebSocket;

const socketStatus = {
    readyState: ref(0),
    authorized: false
};

export const connected = computed(() => socketStatus?.readyState?.value === 1);
const setReadyState = (readyState: number) =>
    (socketStatus.readyState.value = readyState);

const connect = () => {
    console.log('Devices Connecting to WS Server...');

    if (ws) ws.close();
    ws = new WebSocket(import.meta.env.VITE_DEVICES_WS_URL as string);
    setReadyState(ws.readyState);

    ws.addEventListener('open', onConnect);
    ws.addEventListener('message', onMessage);
    ws.addEventListener('error', onError);
    ws.addEventListener('close', onClose);
};

const onConnect = () => {
    setReadyState(ws.readyState);
    console.log('Devices WebSocket Connected!');
};

const onMessage = (message: MessageEvent) => {
    let data;
    try {
        data = JSON.parse(message?.data);
    } catch {
        return ws.send('Invalid JSON!');
    }

    if (data?.state?.authorized !== null)
        socketStatus.authorized = data?.state?.authorized;

    if (data?.state?.authorized === false) {
        const authToken = import.meta.env.VITE_DEVICES_AUTHORIZATION as string;
        sendMessage({ auth: { authorization: authToken } });
    }

    if (data?.commands?.['deviceList']) {
        loadDevices(data?.commands?.['deviceList']);
    }
    if (data?.commands?.['deviceUpdate']) {
        const update = data?.commands?.['deviceUpdate'] as DeviceUpdate;

        updateDevice(update.id, update.status);
    }
};

const onError = (error: Event) => {
    console.warn(error);
};

const onClose = () => {
    setReadyState(ws.readyState);
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

interface Commands {
    [name: string]: any;
}

export const sendCommands = (commands: Commands) => {
    sendMessage({ commands });
};
