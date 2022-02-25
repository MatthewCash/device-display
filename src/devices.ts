import { reactive } from 'vue';
import { sendCommands } from '././devicesConnection';

export interface DeviceStatus {
    online: boolean; // Device is reachable
    state: any; // Controlled state
    changingTo?: DeviceStatus['state']; // Device changing state
}
export interface Device {
    name: string;
    id: string;
    status: DeviceStatus;
    loading?: boolean;
    tags?: string[];
}
export interface DeviceUpdate {
    name: Device['name'];
    id: Device['id'];
    status: DeviceStatus;
    updated?: boolean;
    tags?: Device['tags'];
}

export interface DeviceUpdateRequest {
    name: Device['name'];
    id: Device['id'];
    requestedState: DeviceStatus['state'];
}

export const devices: Device[] = reactive([]);

export const loadDevices = (loadDevices: Device[]) => {
    const deviceFilterTag = import.meta.env.VITE_DEVICE_FILTER_TAG as string;
    const filteredDevices = deviceFilterTag
        ? loadDevices.filter(device => device.tags?.includes(deviceFilterTag))
        : loadDevices;

    devices.length = 0;
    devices.push(...filteredDevices);
};

export const updateDevice = (update: DeviceUpdate) => {
    const device = devices.find(device => device.id === update.id);
    if (!device) return;

    device.loading = update.status.changingTo;
    device.status = update.status;
    device.tags = update.tags;
    device.name = update.name;
};

export const setDevice = (deviceId: string, requestedState: boolean) => {
    const device = devices.find(device => device.id === deviceId);
    if (!device) return;

    const deviceUpdateRequest: DeviceUpdateRequest = {
        name: device.name,
        id: deviceId,
        requestedState
    };

    device.loading = true;

    sendCommands({ deviceUpdateRequest });
};
