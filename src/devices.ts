import { reactive } from 'vue';
import { sendMessage } from '././devicesConnection';

export interface Device {
    name: string;
    id: string;
    status: boolean;
    loading?: boolean;
}
export interface DeviceUpdate {
    name: Device['name'];
    id: Device['id'];
    status: Device['status'];
    updated: boolean;
}

export interface DeviceUpdateRequest {
    name: Device['name'];
    id: Device['id'];
    status: Device['status'];
}

export const devices: Device[] = reactive([]);

export const loadDevices = (loadDevices: Device[]) => {
    devices.length = 0;
    devices.push(...loadDevices);
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

    sendMessage({ deviceUpdateRequest });
};
