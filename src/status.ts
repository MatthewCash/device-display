import { reactive } from 'vue';
import { LightingEffect, lightingEffects } from './effects';

export interface LightingStatus {
    effect: LightingEffect | null;
    hue?: number;
    saturation?: number;
    brightness: number;
    colorTemp?: number;
    power: boolean;
    mode: 'color' | 'white' | 'effect';
}

export const status: LightingStatus = reactive({
    effect: null,
    hue: 0,
    saturation: 100,
    brightness: 100,
    colorTemp: 0,
    power: true,
    mode: 'white'
});

export const setStatus = (wsStatus: any) => {
    status.effect =
        lightingEffects.find(effect => effect.id === wsStatus.effect) ?? null;
    status.hue = wsStatus.hue;
    status.saturation = wsStatus.saturation;
    status.brightness = wsStatus.brightness;
    status.colorTemp = wsStatus.colorTemp;
    status.power = wsStatus.power;
    status.mode = wsStatus.mode;
};
