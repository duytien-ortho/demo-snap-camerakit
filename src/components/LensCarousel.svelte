<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Carousel from "$lib/components/ui/carousel/index.js";

    // props
    export let items: any[] = [];
    export let handleActionClick: (id: string) => void;
</script>

<Carousel.Root
    opts={{
        align: "start",
    }}
    class="w-full md:max-w-sm h-full"
>
    <Carousel.Content>
        {#each items as item, i (i)}
            <Carousel.Item class="basis-1/3">
                <div class="p-1">
                    <Card.Root>
                        <Card.Content
                            class="flex aspect-square items-center justify-center p-6 bg-transparent"
                        >
                            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <img
                                alt={`item-${i}`}
                                src={item?.media?.thumbnail_url}
                                class="object-contain"
                                width={104}
                                height={104}
                                on:click={() => {
                                    console.log("item selected", item);
                                    handleActionClick(item?.snap?.len_id);
                                }}
                            />
                        </Card.Content>
                    </Card.Root>
                </div>
            </Carousel.Item>
        {/each}
    </Carousel.Content>
    <Carousel.Previous />
    <Carousel.Next />
</Carousel.Root>
