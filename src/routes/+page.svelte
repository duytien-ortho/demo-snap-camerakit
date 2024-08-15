<script>
	import GroupsLensesCameraKit from "../components/GroupsLensesCameraKit.svelte";
	import LensesCardContainer from "../components/LensesCardContainer.svelte";
	import SimpleCameraKit from "../components/SimpleCameraKit.svelte";
</script>

<svelte:head>
	<title>Snap Camera Kit</title>
	<meta name="description" content="Snap Camera Kit" />
</svelte:head>

<section>
	<!-- <SimpleCameraKit /> -->
	<!-- <GroupsLensesCameraKit /> -->
	<LensesCardContainer />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
