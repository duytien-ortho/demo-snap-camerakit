<script lang="ts">
    import * as Card from "$lib/components/ui/card";

    export let title: string;
    export let description: string;
</script>

<Card.Root class="w-72">
    <Card.Header>
        <Card.Title>
            {title}
        </Card.Title>
        <Card.Description>
            {description}
        </Card.Description>
    </Card.Header>
    <Card.Content>
        <!-- <p>Card Content</p> -->
    </Card.Content>
    <Card.Footer>
        <!-- <p>Card Footer</p> -->
    </Card.Footer>
</Card.Root>
