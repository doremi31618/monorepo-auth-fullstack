<script lang="ts">
    import { authStore } from '$lib/store/authStore';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { appRoutePath } from '$lib/config/route';
    import { onDestroy } from 'svelte';

    const { children } = $props();

    if (browser) {
        const unsubscribe = authStore.subscribe(async (session) => {
            if (!session) {
                goto(appRoutePath.auth.login);
            }
        });
        onDestroy(unsubscribe);
    }
</script>

{@render children?.()}
