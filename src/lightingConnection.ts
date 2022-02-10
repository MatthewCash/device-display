import { ref, computed } from 'vue';
import { loadEffects } from './effects';
import { setStatus } from './status';

let ws: WebSocket;
let readyState = ref(0);

export const connected = computed(() => readyState.value === 1);

const connect = () => {
    console.log('Connecting to Lighting WS Server...');

    if (ws) ws.close();
    ws = new WebSocket(import.meta.env.VITE_LIGHTING_WS_URL as string);
    readyState.value = ws.readyState;

    ws.addEventListener('open', onConnect);
    ws.addEventListener('message', onMessage);
    ws.addEventListener('error', onError);
    ws.addEventListener('close', onClose);
};

const onConnect = () => {
    const authToken = import.meta.env.VITE_LIGHTING_AUTHORIZATION as string;
    if (authToken) {
        ws.send(
            JSON.stringify({
                authorization: authToken
            })
        );
    }

    readyState.value = ws.readyState;
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
    readyState.value = ws.readyState;
    console.log('Lighting WebSocket Disconnected!');
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
