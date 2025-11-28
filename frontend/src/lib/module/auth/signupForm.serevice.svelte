<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import type { ComponentProps } from "svelte";
	import { authStore } from "$lib/store/authStore";
	import { appRoutePath } from "$lib/config/route";
	import type { AuthState } from "$lib/store/authStore";
	import { onDestroy } from "svelte";
	import { Spinner } from "$lib/components/ui/spinner/index.js";


	let authState = $state<AuthState>({ session: null, status: "idle", message: null });
	const unsubscribe = authStore.subscribe((value) => (authState = value));
	onDestroy(unsubscribe);
	const { register } = authStore;
	const form = $state({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	// let isLoading = $state(false);
	let fieldErrors = $state<{ email?: string; password?: string; confirmPassword?: string }>({});
	const isLoading = $derived(authState.status === "loading");
	const apiError = $derived(authState.status === "error" ? authState.message : null);
	const apiSuccess = $derived(authState.status === "success" ? authState.message : null);

	function validateForm() {
		const nextErrors: { password?: string; confirmPassword?: string } = {};
		if (form.password.length < 8) {
			nextErrors.password = "Password must be at least 8 characters long.";
		}
		if (form.password !== form.confirmPassword) {
			nextErrors.confirmPassword = "Passwords do not match.";
		}
		fieldErrors = nextErrors;
		return Object.keys(nextErrors).length === 0;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!validateForm()) return;
		await register(form.name.trim(), form.email.trim(), form.password);
	}

	function handlePasswordConfirmChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.value !== form.password) {
			fieldErrors.confirmPassword = "Passwords do not match.";
		} else {
			fieldErrors.confirmPassword = undefined;
		}
	}

	function handleEmailChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (!target.value.includes('@')) {
			fieldErrors.email = "Invalid email address.";
		} else {
			fieldErrors.email = undefined;
		}
	}

	let { ...restProps }: ComponentProps<typeof Card.Root> = $props();


</script>

<Card.Root {...restProps}>
	<Card.Header>
		<Card.Title>Create an account</Card.Title>
		<Card.Description>Enter your information below to create your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form onsubmit={handleSubmit}>
			<Field.Group>
				<Field.Field>
					<Field.Label for="name">Full Name</Field.Label>
					<Input id="name" type="text" placeholder="John Doe" bind:value={form.name} required />
				</Field.Field >
				<Field.Field data-invalid={Boolean(fieldErrors.email || apiError)}>
					<Field.Label for="email">Email</Field.Label>
					<Input oninput={handleEmailChange} id="email" type="email" placeholder="m@example.com" bind:value={form.email} required />
					<Field.Description>
						We'll use this to contact you. We will not share your email with anyone
						else.
					</Field.Description>
					{#if fieldErrors.email}
						<Field.Error>{fieldErrors.email}</Field.Error>
					{/if}
				</Field.Field>
				<Field.Field data-invalid={Boolean(fieldErrors.password || apiError)}>
					<Field.Label for="password">Password</Field.Label>
					<Input
						id="password"
						type="password"
						bind:value={form.password}
						aria-invalid={Boolean(fieldErrors.password || apiError)}
						required
					/>
					<Field.Description>Must be at least 8 characters long.</Field.Description>
					{#if fieldErrors.password}
						<Field.Error>{fieldErrors.password}</Field.Error>
					{/if}
				</Field.Field>
				<Field.Field data-invalid={Boolean(fieldErrors.confirmPassword || apiError)}>
					<Field.Label for="confirm-password">Confirm Password</Field.Label>
					<Input
						id="confirm-password"
						type="password"
						bind:value={form.confirmPassword}
						oninput={handlePasswordConfirmChange}
						aria-invalid={Boolean(fieldErrors.confirmPassword || apiError)}
						required
					/>
					<Field.Description>Please confirm your password.</Field.Description>
					{#if fieldErrors.confirmPassword}
						<Field.Error>{fieldErrors.confirmPassword}</Field.Error>
					{/if}
				</Field.Field>
				<Field.Group>
					<Field.Field>
						<Button type="submit" disabled={isLoading} aria-busy={isLoading}>
							{#if isLoading}
								<Spinner />
							{:else}
								Create Account
							{/if}
						</Button>
						{#if apiError}
							<Field.Error class="mt-2 text-center">{apiError}</Field.Error>
						{/if}
						{#if apiSuccess}
							<Field.Description class="mt-2 text-center text-emerald-600 dark:text-emerald-400">
								{apiSuccess}
							</Field.Description>
						{/if}
						<!-- <Button variant="outline" type="button">Sign up with Google</Button> -->
						<Field.Description class="px-6 text-center">
							Already have an account? <a href={appRoutePath.auth.login}>Sign in</a>
						</Field.Description>
					</Field.Field>
				</Field.Group>
			</Field.Group>
		</form>
	</Card.Content>
</Card.Root>
