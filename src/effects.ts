import { reactive } from 'vue';
import { sendMessage } from './lightingConnection';

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
    sendMessage({ reloadLightingEffects: true });
};
