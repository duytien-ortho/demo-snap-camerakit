<script lang="ts">
    import { API_TOKEN, TEST_LENS_1, TEST_LENS_2 } from "$lib/constants";
    import {
        bootstrapCameraKit,
        createMediaStreamSource,
        Transform2D,
    } from "@snap/camera-kit";
    import { onDestroy, onMount } from "svelte";

    let canvas: HTMLCanvasElement;
    let stream: MediaStream;

    onMount(() => {
        if (typeof window !== "undefined" && navigator) {
            (async () => {
                console.log("init camera kit...");
                const cameraKit = await bootstrapCameraKit({
                    apiToken: API_TOKEN,
                });
                const session = await cameraKit.createSession({
                    liveRenderTarget: canvas,
                });
                session.events.addEventListener("error", (e) => {
                    console.error("error of session:", JSON.stringify(e));
                });

                stream = await window.navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                const source = createMediaStreamSource(stream, {
                    transform: Transform2D.MirrorX,
                    cameraType: "user",
                });
                await session.setSource(source);
                await session.play();

                const lens = await cameraKit.lensRepository.loadLens(
                    // TEST_LENS_1,
                    // TEST_LENS_2,
                    "f00dee34-8ff6-4ed5-bc35-217311de371f",
                    "19da52f2-6afe-4fb5-8ab2-345295ddc00d",
                );
                await session.applyLens(lens);
            })();
        }
    });

    onDestroy(async () => {
        if (canvas) {
            stream.getTracks().forEach((track) => track.stop());
            console.log("destroy camera kit canvas");
        }
    });
</script>

<canvas width={640} height={640} bind:this={canvas}></canvas>
