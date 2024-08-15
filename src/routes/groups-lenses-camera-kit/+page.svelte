<!-- 
 - snapchat doesn't actually take picture, it takes a screenshot. 
    => instead of getting a phones scrisp camera sensor quality, 
    just getting the resolution of phone screen.
    => save data and storage space. The whole point of this is for quick pictures, 
    dont need all the detail more purposely taken photo with the camera app
-->
<script lang="ts">
    import GroupsLensesCameraKit from "../../components/GroupsLensesCameraKit.svelte";

    type PageData = { collections: any };

    export let data: PageData;
    $: transformData = transformPageDataToGroupsId(data);
    $: collectionName = data?.collections?.name;
    $: rawItems = transformToItems(data);

    function transformPageDataToGroupsId(pageData: PageData | null): string[] {
        if (pageData?.collections) {
            const collectionGroupId = pageData?.collections?.snap?.group_id;
            const itemsGroupId: string[] = [];
            for (const item of pageData?.collections?.items) {
                if (!itemsGroupId?.includes(item?.snap?.group_id)) {
                    itemsGroupId.push(item?.snap?.group_id);
                }
            }

            return [collectionGroupId, ...itemsGroupId];
        }
        return [];
    }

    function transformToItems(pageData: PageData | null): any[] {
        if (pageData?.collections) {
            return pageData?.collections?.items;
        }
        return [];
    }
</script>

<div class="flex container w-full flex-col justify-center items-center">
    <GroupsLensesCameraKit groupsId={transformData} {rawItems} />
</div>
