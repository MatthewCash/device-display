import { computed, ref } from 'vue';
import {
    loadDevices,
    DeviceUpdate,
    updateDevice,
    DeviceUpdateRequest,
    Device
} from './devices';

const params = new URLSearchParams(window.location.search);

const deviceWsUrl = params.get('devices-ws-url') || 'ws://epsilon.zero:3001';
const devicesAuthToken = params.get('devices-auth-token');

if (!devicesAuthToken) {
    console.error('No auth token provided!');
}

let ws: WebSocket;

const socketStatus = {
    readyState: ref(0),
    authorized: ref(false),
    alive: false
};

export const connected = computed(
    () =>
        socketStatus.readyState.value === WebSocket.OPEN &&
        socketStatus.authorized.value
);
const setReadyState = (readyState: number) =>
    (socketStatus.readyState.value = readyState);

const connect = () => {
    console.log('Devices Connecting to WS Server...');

    if (ws?.readyState === WebSocket.OPEN) ws.close();

    try {
        ws = new WebSocket(deviceWsUrl);

        ws.addEventListener('open', onConnect);
        ws.addEventListener('message', onMessage);
        ws.addEventListener('error', onError);
        ws.addEventListener('close', onClose);
    } catch (error) {
        console.error(error);
    }

    setReadyState(ws?.readyState ?? WebSocket.CLOSED);
};

const onConnect = () => {
    setReadyState(ws.readyState);
    console.log('Devices WebSocket Connected!');
};

export interface InternalDeviceUpdate {
    name: Device['name'];
    id: Device['id'];
    status: Device['status'];
}
interface OutboundCommands {
    deviceUpdateRequest?: DeviceUpdateRequest;
    setScene?: string | any;
    reloadLightingEffects?: boolean;
}

interface InboundCommands {
    deviceUpdate?: DeviceUpdate;
    deviceList?: Device[];
}

interface InboundSocketMessage {
    commands?: InboundCommands;
    auth?: {
        authorization?: string;
    };
    state?: {
        authorized?: boolean;
    };
    connection?: {
        ping?: true;
    };
}

interface OutboundSocketMessage {
    commands?: OutboundCommands;
    auth?: {
        authorization?: string;
    };
    connection?: {
        pong?: true;
    };
}

const onMessage = (message: MessageEvent) => {
    let data: InboundSocketMessage;
    try {
        data = JSON.parse(message?.data);
    } catch {
        return ws.send('Invalid JSON!');
    }

    if (data?.connection?.ping === true) {
        socketStatus.alive = true;
        sendMessage({ connection: { pong: true } });
    }

    if (data?.state?.authorized != null) {
        socketStatus.authorized.value = data?.state?.authorized;
    }

    if (data?.state?.authorized === false) {
        if (!devicesAuthToken)
            console.error('No devices authorization token provided!');

        sendMessage({ auth: { authorization: devicesAuthToken! } });
    }

    const deviceList = data?.commands?.deviceList;
    if (deviceList) {
        loadDevices(deviceList);
    }

    const deviceUpdate = data?.commands?.deviceUpdate;
    if (deviceUpdate) {
        updateDevice(deviceUpdate);
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
        if (!socketStatus.alive) connect();

        socketStatus.alive = false;
    }, 5000);
};

export const sendMessage = (data: OutboundSocketMessage) => {
    ws.send(JSON.stringify(data));
};

export const sendCommands = (commands: OutboundCommands) => {
    sendMessage({ commands });
};
