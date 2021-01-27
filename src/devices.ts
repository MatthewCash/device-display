import { reactive } from 'vue';
import { sendMessage } from '././devicesConnection';

export interface Device {
    id: string;
    online: boolean;
    name: string;
}

export const devices: Device[] = reactive([]);

export const loadDevices = (loadDevices: Device[]) => {
    devices.length = 0;
    devices.push(...loadDevices);
};

export const updateDevice = (deviceId: string, status: boolean) => {
    const device = devices.find(device => device.id === deviceId);
    if (!device) return;

    device.online = !!status;
};

export const setDevice = (deviceId: string, status: boolean) => {
    sendMessage({
        devices: {
            [deviceId]: status
        }
    });
};
