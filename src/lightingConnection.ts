import { loadEffects } from './effects';
import { setStatus } from './status';

let ws: WebSocket;

const connect = () => {
    console.log('Connecting to Lighting WS Server...');
    if (ws) ws.close();
    ws = new WebSocket(import.meta.env.VITE_LIGHTING_WS_URL as string);

    ws.addEventListener('open', onConnect);
    ws.addEventListener('message', onMessage);
    ws.addEventListener('error', onError);
    ws.addEventListener('close', onClose);
};

const onConnect = () => {
    console.log('Lighting WebSocket Connected!');
};

const onMessage = (message: MessageEvent) => {
    let data;
    try {
        data = JSON.parse(message?.data);
    } catch {
        return ws.send('Invalid JSON!');
    }
    if (data.effects) {
        loadEffects(data.effects);
    }
    if (data.status) {
        setStatus(data.status);
    }
};
const onError = (error: Event) => {
    console.warn(error);
};

const onClose = () => {
    console.log('Lighting WebSocket Disconnected!');
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