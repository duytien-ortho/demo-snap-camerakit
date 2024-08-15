<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import { Switch } from "$lib/components/ui/switch/index.js";

    export let handleAction: () => void;
    export let currentCamera: "user" | "environment" = "user";

    $: switchMessage =
        currentCamera === "user" ? "Back camera" : "Front camera";
</script>

<div class="flex items-center space-x-2">
    <Switch id="airplane-mode" onCheckedChange={handleAction} />
    <Label for="airplane-mode">{switchMessage}</Label>
</div>
