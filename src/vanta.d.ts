declare module 'vanta/dist/vanta.fog.min' {
    import * as THREE from 'three'

    interface VantaOptions {
        el: HTMLElement | null;
        mouseControls?: boolean;
        touchControls?: boolean;
        gyroControls?: boolean;
        minHeight?: number;
        minWidth?: number;
        scale?: number;
        scaleMobile?: number;
        highlightColor?: number;
        midtoneColor?: number;
        lowlightColor?: number;
        baseColor?: number;
        blurFactor?: number;
        speed?: number;
        zoom?: number;
        THREE?: typeof THREE;
        // добавьте другие опции, если они есть
    }

    const FOG: (options: VantaOptions) => void
    export default FOG
}
