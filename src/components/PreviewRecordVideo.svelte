<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import { videoUrl } from "../stores/video";

    let time = 0;
    let duration;
    let paused = true;

    $: {
        console.log("videoUrl", $videoUrl);
    }

    async function downloadVideo() {
        if (!$videoUrl) return;
        const link = document.createElement("a");
        link.href = $videoUrl;
        const date = new Date();
        link.download = `video-${date.getTime()}.mp4`;
        link.click();
        link.remove();
    }
</script>

<section
    id="video-container"
    class="flex flex-col items-center justify-center gap-4 md:w-full w-screen"
>
    {#if $videoUrl}
        <video
            id="video"
            controls
            playsinline
            src={$videoUrl}
            bind:currentTime={time}
            bind:duration
            bind:paused
            preload="none"
        >
            <track kind="captions" />
        </video>
    {:else}
        <div class="flex flex-col items-center justify-center gap-4">
            <h1 class="text-4xl font-bold">No video to download</h1>
        </div>
    {/if}

    <div>
        <Button disabled={!$videoUrl} on:click={downloadVideo}
            >Download video</Button
        >
    </div>
</section>

<style>
    video {
        width: 100%;
    }
</style>
