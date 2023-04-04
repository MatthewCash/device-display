import { reactive } from 'vue';
import { sendCommands } from '././devicesConnection';
import { loadEffects } from './effects';

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
    tags: string[];
    capabilities: string[];
}
export interface DeviceUpdate {
    name: Device['name'];
    id: Device['id'];
    status: DeviceStatus;
    tags?: Device['tags'];
    capabilities?: Device['capabilities'];
}

export interface DeviceUpdateRequest {
    name: Device['name'];
    id: Device['id'];
    requestedState: DeviceStatus['state'];
}
const params = new URLSearchParams(window.location.search);

export const devices: Device[] = reactive([]);

export const loadDevices = (loadDevices: Device[]) => {
    const deviceFilterTag = params.get('device-filter-tag');
    const filteredDevices = deviceFilterTag
        ? loadDevices.filter(device => device.tags?.includes(deviceFilterTag))
        : loadDevices;

    devices.length = 0;
    devices.push(...filteredDevices);

    const lights = devices.find(device => device.id === 'lights');

    if (lights) {
        loadEffects(lights.status.state.effects);
    }
};

export const updateDevice = (update: DeviceUpdate) => {
    const device = devices.find(device => device.id === update.id);
    if (!device) return;

    device.loading = update.status.changingTo;
    device.status = update.status;
    device.name = update.name;
    device.tags = update.tags ?? device.tags;
    device.capabilities = update.capabilities ?? device.capabilities;

    const lights = devices.find(device => device.id === 'lights');

    if (lights) {
        loadEffects(lights.status.state.effects);
    }
}

export const updateDeviceState = (
    deviceId: string,
    requestedState: DeviceStatus['state']
) => {
    const device = devices.find(device => device.id === deviceId);
    if (!device) return;

    if (
        Object.keys(requestedState).length === 1 &&
        requestedState.power != null
    )
        device.loading = true;

    const deviceUpdateRequest: DeviceUpdateRequest = {
        name: device.name,
        id: deviceId,
        requestedState
    };

    sendCommands({ deviceUpdateRequest });
};
