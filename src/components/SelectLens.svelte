<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
    import type { Lens } from "@snap/camera-kit";

    export let selectedLens: Lens | null = null;
    export let optionsData: { value: string; label: string }[] = [];
    export let handleApply: (id: string) => Promise<void>;

    $: selectedOption = selectedLens
        ? optionsData.find((option) => option.value === selectedLens.id)
        : undefined;

    function onSelectedChange(e: any) {
        console.log("select lens", e);
        const val = e?.value as string;
        handleApply(val);
    }
</script>

<Select.Root portal={null} {onSelectedChange} selected={selectedOption}>
    <Select.Trigger class="w-[180px]">
        <Select.Value placeholder="Select lens" />
    </Select.Trigger>
    <Select.Content>
        <ScrollArea class="h-[300px]">
            <Select.Group>
                <Select.Label>Lens</Select.Label>
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
