import { computed, ref } from 'vue';
import {
    loadDevices,
    DeviceUpdate,
    updateDevice,
    DeviceUpdateRequest,
    Device
} from './devices';

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

export interface InternalDeviceUpdate {
    name: Device['name'];
    id: Device['id'];
    status: Device['status'];
}
interface Commands {
    deviceUpdateRequest?: DeviceUpdateRequest;
    internalDeviceUpdate?: InternalDeviceUpdate;
    deviceUpdate?: DeviceUpdate;
    deviceList?: Device[];
    setScene?: string | any;
}

interface SocketMessage {
    commands?: Commands;
    auth?: {
        authorization?: string;
    };
    state?: {
        authorized?: boolean;
    };
}

const onMessage = (message: MessageEvent) => {
    let data: SocketMessage;
    try {
        data = JSON.parse(message?.data);
        console.log('got data')
        console.log(data)
    } catch {
        return ws.send('Invalid JSON!');
    }

    if (data?.state?.authorized !== null)
        socketStatus.authorized = !!data?.state?.authorized;

    if (data?.state?.authorized === false) {
        const authToken = import.meta.env.VITE_DEVICES_AUTHORIZATION as string;

        if (!authToken) console.error('No devices authorization token provided!')

        sendMessage({ auth: { authorization: authToken } });
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
        if (connected.value) return;
        connect();
    }, 3000);
};

export const sendMessage = (data: any) => {
    ws.send(JSON.stringify(data));
};

export const sendCommands = (commands: Commands) => {
    sendMessage({ commands });
};
