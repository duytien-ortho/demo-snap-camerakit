<script context="module">
    export const ssr = false;
</script>

<script lang="ts">
    import {
        bootstrapCameraKit,
        CameraKitSession,
        createMediaStreamSource,
        Transform2D,
        type Lens,
    } from "@snap/camera-kit";
    import { onDestroy, onMount, tick } from "svelte";
    import { PUBLIC_API_TOKEN } from "$env/static/public";
    import type { Action } from "svelte/action";
    import SwitchCamera from "./SwitchCamera.svelte";
    import LensCarousel from "./LensCarousel.svelte";
    import { type Readable } from "svelte/store";
    import { useMediaQuery } from "../utils/useMediaQuery";
    import { fps, updateFps } from "../stores/fps";
    import Button from "$lib/components/ui/button/button.svelte";
    import SelectCamera from "./SelectCamera.svelte";
    import { videoUrl } from "../stores/video";
    import { goto } from "$app/navigation";

    // props
    export let groupsId: string[] = [];
    // export let collectionName: string | null = null;
    export let rawItems: any[] = [];

    let canvas: HTMLCanvasElement;
    let session: CameraKitSession | null = null;
    let stream: MediaStream;
    let lensesData: Lens[] = [];
    let cameraType: "user" | "environment" = "user"; // default front camera
    let selectedLens: Lens | null = null;
    let lensesOptions: { value: string; label: string }[] = [];
    let cameraOptions: { value: string; label: string }[] = [];
    let selectedCamera: string | null = null;

    let isRecording = false;
    let mediaRecorder: MediaRecorder | null = null;
    let videoRecordDuration = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const isMobile: Readable<boolean> = useMediaQuery("(max-width: 768px)");

    $: if ($isMobile) {
        // canvas.style.width = "320px";
        // canvas.style.maxWidth = "320px";
    }

    $: if (isRecording) {
        intervalId = setInterval(() => {
            videoRecordDuration += 1;
        }, 1000);
    }

    function transformLensesOptions(lenses: Lens[]) {
        let options: { value: string; label: string }[] = [];

        for (const lens of lenses) {
            if (!options.find((option) => option.value === lens.id)) {
                options.push({
                    value: lens.id,
                    label: lens.name,
                });
            }
        }
        return options;
    }

    async function applyLens(id: string) {
        const lens = lensesData.find((lens) => lens.id === id);
        if (lens) {
            selectedLens = lens;
            await session?.applyLens(lens);
        }
    }

    async function switchCamera() {
        if (!session) return;
        cameraType = cameraType === "user" ? "environment" : "user";

        if (stream) {
            session.pause();
            stream.getVideoTracks()[0].stop();
        }

        stream = await window.navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: cameraType,
            },
        });

        const source = createMediaStreamSource(stream, {
            transform: Transform2D.MirrorX,
            cameraType: cameraType,
            fpsLimit: 60,
        });
        await session.setSource(source);
        await session?.play();
        if (selectedLens) {
            await session?.applyLens(selectedLens);
        }
    }

    async function takePhoto() {
        if (!canvas) return;

        const imageURI = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imageURI;
        const date = new Date();
        link.download = `snapshot-${date.getTime()}.png`;
        link.click();
    }

    async function getCameraOptions(session: CameraKitSession) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(
            (device) => device.kind === "videoinput",
        );

        const options: { value: string; label: string }[] = [];
        for (const camera of cameras) {
            options.push({
                value: camera.deviceId,
                label: camera.label,
            });
        }
        return options;
    }

    async function setCameraKitSource(deviceId?: string) {
        if (!session || !deviceId) return;
        if (stream) {
            session.pause();
            stream.getVideoTracks()[0].stop();
        }

        stream = await window.navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: deviceId,
            },
        });

        const source = createMediaStreamSource(stream);
        await session.setSource(source);
        source.setTransform(Transform2D.MirrorX);
        await session?.play();
        if (selectedLens) {
            await session?.applyLens(selectedLens);
        }
    }

    async function startRecording() {
        isRecording = true;

        const mediaStream = canvas.captureStream(30); // 30 fps, default is 30 frames
        mediaRecorder = new MediaRecorder(mediaStream);
        mediaRecorder.addEventListener("dataavailable", (event) => {
            if (!event.data.size) {
                console.warn("No recorded data available");
                return;
            }

            const blob = new Blob([event.data]);
            let downloadUrl = window.URL.createObjectURL(blob);

            videoUrl.set(downloadUrl);
        });
        console.log("start recording");
        mediaRecorder.start();
    }

    async function stopRecording() {
        isRecording = false;
        mediaRecorder?.stop();

        mediaRecorder?.stream?.getTracks().forEach((track) => track.stop());
        stream.getTracks().forEach((track) => track.stop());
        if (intervalId) {
            clearInterval(intervalId);
        }
        tick();

        goto("/download-video");
    }

    const initCanvas: Action = (node) => {
        console.log("init canvas");
        // node.style.width = "720px";
        node.style.objectFit = "contain";
        return {
            destroy() {
                console.log("destroy canvas");
            },
        };
    };

    onMount(() => {
        if (typeof window !== "undefined" && navigator) {
            (async () => {
                console.log("init camera kit...");

                if (!PUBLIC_API_TOKEN) {
                    throw new Error("Can not load api token");
                }
                // talk with webassembly
                const cameraKit = await bootstrapCameraKit({
                    apiToken: PUBLIC_API_TOKEN,
                });
                session = await cameraKit.createSession({
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
                    cameraType: cameraType,
                    fpsLimit: 60,
                });
                await session.setSource(source);
                // set resolution of canvas
                // await source.setRenderSize(720, 1280);
                await session.play();

                const { lenses } =
                    await cameraKit.lensRepository.loadLensGroups(groupsId);

                lensesData = lenses;
                lensesOptions = transformLensesOptions(lenses);
                selectedLens = lenses[0];
                await session.applyLens(selectedLens);

                updateFps();
                cameraOptions = await getCameraOptions(session);
                selectedCamera = cameraOptions[0].value;
            })();
        }
    });

    // destroy camera kit canvas
    onDestroy(async () => {
        if (canvas) {
            stream.getTracks().forEach((track) => track.stop());
            console.log("destroy camera kit canvas");
        }
    });
</script>

<div class="flex flex-col items-center justify-center gap-4 mb-4">
    <!-- <h2 class="text-xl font-bold text-black">Collection: {collectionName}</h2> -->

    <div class="flex items-center justify-center gap-2">
        <div class="text-xs text-red-500">
            {$fps} FPS
        </div>
        <SwitchCamera handleAction={switchCamera} currentCamera={cameraType} />
        <Button on:click={takePhoto}>Take photo</Button>
        <!-- <SelectLens
            {selectedLens}
            optionsData={lensesOptions}
            handleApply={applyLens}
        /> -->
    </div>

    <div class="flex items-center justify-center gap-2 flex-wrap">
        <SelectCamera
            {selectedCamera}
            optionsData={cameraOptions}
            handleApply={async (value) => {
                await setCameraKitSource(value);
            }}
        />

        <Button disabled={isRecording} on:click={startRecording}
            >Start recording</Button
        >

        <Button on:click={stopRecording}>Stop recording</Button>

        {#if isRecording}
            <div class="text-xs text-red-500">
                {videoRecordDuration} seconds
            </div>
        {/if}
    </div>
</div>

<div class="w-screen flex flex-col items-center justify-center">
    <canvas class="md:w-auto w-screen" bind:this={canvas} use:initCanvas
    ></canvas>
</div>

<div class="fixed bottom-2 w-full h-[120px] z-50">
    <div class="flex justify-center relative backdrop-blur-[25px] bg-black/15">
        <LensCarousel items={rawItems} handleActionClick={applyLens} />
    </div>
</div>
