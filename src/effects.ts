import { reactive } from 'vue';
import { sendCommands } from './devicesConnection';

export interface LightingEffect {
    interval: number;
    id: string;
    name: string;
}

export const lightingEffects: LightingEffect[] = reactive([]);

export const loadEffects = (effects: LightingEffect[]) => {
    lightingEffects.length = 0;
    lightingEffects.push(...effects);
};

export const reloadEffects = () => {
    sendCommands({ reloadLightingEffects: true });
};
