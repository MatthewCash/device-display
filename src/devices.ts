import { reactive } from 'vue';
import { sendCommands } from '././devicesConnection';

export interface Device {
    name: string;
    id: string;
    status: boolean;
    loading?: boolean;
    tags?: string[];
}
export interface DeviceUpdate {
    name: Device['name'];
    id: Device['id'];
    status: Device['status'];
    updated: boolean;
    tags?: Device['tags'];
}

export interface DeviceUpdateRequest {
    name: Device['name'];
    id: Device['id'];
    status: Device['status'];
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

export const updateDevice = (deviceId: string, status: boolean) => {
    const device = devices.find(device => device.id === deviceId);
    if (!device) return;

    device.loading = false;

    device.status = !!status;
};

export const setDevice = (deviceId: string, status: boolean) => {
    const device = devices.find(device => device.id === deviceId);
    if (!device) return;

    const deviceUpdateRequest: DeviceUpdateRequest = {
        name: device.name,
        id: deviceId,
        status
    };

    device.loading = true;

    sendCommands({ deviceUpdateRequest });
};
