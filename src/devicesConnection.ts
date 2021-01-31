import { loadDevices, updateDevice } from './devices';

let ws: WebSocket;

const connect = () => {
    console.log('Devices Connecting to WS Server...');
    if (ws) ws.close();
    ws = new WebSocket(import.meta.env.VITE_DEVICES_WS_URL as string);

    ws.addEventListener('open', onConnect);
    ws.addEventListener('message', onMessage);
    ws.addEventListener('error', onError);
    ws.addEventListener('close', onClose);
};

const onConnect = () => {
    console.log('Devices WebSocket Connected!');
};

const onMessage = (message: MessageEvent) => {
    let data;
    try {
        data = JSON.parse(message?.data);
    } catch {
        return ws.send('Invalid JSON!');
    }

    if (data.devices) {
        loadDevices(data.devices);
    }
    if (data.deviceUpdate) {
        updateDevice(data.deviceUpdate.id, data.deviceUpdate.status);
    }
};
const onError = (error: Event) => {
    console.warn(error);
};

const onClose = () => {
    console.log('Devices WebSocket Disconnected!');
};

export const startWebSocketConnection = () => {
    connect();
    setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) return;
        connect();
    }, 3000);
};

export const sendMessage = (data: any) => {
    ws.send(JSON.stringify(data));
};
