declare module 'vanta/dist/vanta.fog.min' {
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
        // добавьте другие опции, если они есть
    }

    const FOG: (options: VantaOptions) => void
    export default FOG
}
