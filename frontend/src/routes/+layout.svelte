<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script src="https://accounts.google.com/gsi/client" async></script>
</svelte:head>

{@render children?.()}
