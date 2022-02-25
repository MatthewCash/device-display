import { ref, computed } from 'vue';
import { loadEffects } from './effects';
import { setStatus } from './status';

const lightingWsUrl =
    String(import.meta.env.VITE_LIGHTING_WS_URL) || 'ws://epsilon.zero:3001';
const lightingAuthToken = String(import.meta.env.VITE_LIGHTING_AUTHORIZATION);

let ws: WebSocket;
let readyState = ref(0);
export const alive = ref(false);

export const connected = computed(() => readyState?.value === WebSocket.OPEN);

const connect = () => {
    console.log('Connecting to Lighting WS Server...');

    if (ws) ws.close();

    try {
        ws = new WebSocket(lightingWsUrl);

        ws.addEventListener('open', onConnect);
        ws.addEventListener('message', onMessage);
        ws.addEventListener('error', onError);
        ws.addEventListener('close', onClose);
    } catch (error) {
        console.error(error);
    }

    readyState.value = ws?.readyState ?? WebSocket.CLOSED;
};

const onConnect = () => {
    if (lightingAuthToken) {
        ws.send(
            JSON.stringify({
                authorization: lightingAuthToken
            })
        );
    }

    readyState.value = ws.readyState;
    console.log('Lighting WebSocket Connected!');
};

const onMessage = (message: MessageEvent) => {
    if (message?.data?.toString() === 'ping') {
        return (alive.value = true);
    }

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
        if (!alive.value) return connect();

        alive.value = false;
    }, 5000);
};

export const sendMessage = (data: any) => {
    ws.send(JSON.stringify(data));
};
