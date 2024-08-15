import { writable } from "svelte/store";

export const fps = writable(0);

export function updateFps() {
    let lastTime = performance.now();
    let frameCount = 0;

    function frame(time: number) {
        frameCount++;
        const deltaTime = time - lastTime;
        if (deltaTime >= 1000) {
            fps.set(Math.round((frameCount * 1000) / deltaTime));
            frameCount = 0;
            lastTime = time;
        }
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}