<script lang="ts">
	import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import * as authApi from "$lib/api/auth";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const id = $props.id();
	const tokenParam = $page.url.searchParams.get("token") ?? "";

	let token = $state(tokenParam);
	let password = $state("");
	let isLoading = $state(false);
	let errorMsg: string | null = $state(null);
	let successMsg: string | null = $state(null);

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isLoading = true;
		errorMsg = null;
		successMsg = null;
		try {
			const res = await authApi.confirmPasswordReset(token, password);
			if (res.statusCode < 200 || res.statusCode >= 300) {
				throw new Error(res.message ?? "Reset failed");
			}
			successMsg = "Password reset successful. You can now log in.";
			const next = res.data?.redirect ?? "/auth/login";
			await goto(next);
		} catch (err) {
			errorMsg = (err as Error)?.message ?? "Failed to reset password";
		} finally {
			isLoading = false;
		}
	}
</script>

<div class={cn("flex flex-col gap-6", className)} bind:this={ref} {...restProps}>
	<form class="space-y-4">
		<div class="flex flex-col items-center gap-2 text-center">
			<a href="##" class="flex flex-col items-center gap-2 font-medium">
				<div class="flex size-8 items-center justify-center rounded-md">
					<GalleryVerticalEndIcon class="size-6" />
				</div>
				<span class="sr-only">Acme Inc.</span>
			</a>
			<h1 class="text-xl font-bold">Reset Password</h1>
			<Field.Description>
				Enter a new password to secure your account.
			</Field.Description>
		</div>
		<Field.Field>
			<Field.Label for="token-{id}">Reset Token</Field.Label>
			<Input
				id="token-{id}"
				bind:value={token}
				placeholder="Paste reset token"
				required
			/>
		</Field.Field>
		<Field.Field>
			<Field.Label for="password-{id}">New Password</Field.Label>
			<Input
				id="password-{id}"
				bind:value={password}
				type="password"
				placeholder="New password"
				required
			/>
		</Field.Field>
		{#if errorMsg}
			<Field.Description class="text-red-500">{errorMsg}</Field.Description>
		{/if}
		{#if successMsg}
			<Field.Description class="text-green-600">{successMsg}</Field.Description>
		{/if}
		<Button type="submit" onclick={handleSubmit} disabled={isLoading}>
			{#if isLoading}Submitting...{:else}Reset Password{/if}
		</Button>
	</form>
</div>
