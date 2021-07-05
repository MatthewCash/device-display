import { reactive } from 'vue';
import { sendMessage } from '././devicesConnection';

export interface Device {
    name: string;
    id: string;
    status: boolean;
}
export interface StatusUpdate {
    name: Device['name'];
    id: Device['id'];
    status: Device['status'];
    updated?: boolean;
}



export const devices: Device[] = reactive([]);

export const loadDevices = (loadDevices: Device[]) => {
    devices.length = 0;
    devices.push(...loadDevices);
};

export const updateDevice = (deviceId: string, status: boolean) => {
    const device = devices.find(device => device.id === deviceId);
    if (!device) return;

    device.status = !!status;
};

export const setDevice = (deviceId: string, status: boolean) => {
    const update: StatusUpdate = {
        name: devices.find(device => device.id === deviceId)!.name,
        id: deviceId,
        status
    }


    sendMessage({
        incomingDeviceUpdate: update
    });
};
