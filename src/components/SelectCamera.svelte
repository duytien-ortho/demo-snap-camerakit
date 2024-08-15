<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

    export let selectedCamera: string | null = null;
    export let optionsData: { value: string; label: string }[] = [];
    export let handleApply: (value: string) => Promise<void>;

    $: selectedOption = selectedCamera
        ? optionsData.find((option) => option.value === selectedCamera)
        : undefined;

    function onSelectedChange(e: any) {
        const val = e?.value as string;
        handleApply(val);
    }
</script>

<Select.Root portal={null} {onSelectedChange} selected={selectedOption}>
    <Select.Trigger class="w-[180px]">
        <Select.Value placeholder="Select camera" />
    </Select.Trigger>
    <Select.Content>
        <ScrollArea class="h-[300px]">
            <Select.Group>
                <Select.Label>Camera</Select.Label>
                {#each optionsData as option}
                    <Select.Item value={option.value} label={option.label}>
                        {option.label}
                    </Select.Item>
                {/each}
            </Select.Group>
        </ScrollArea>
    </Select.Content>
    <Select.Input name="Select option" />
</Select.Root>
