
/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname =
	typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Workaround for Nx graph generation where CWD is root but sveltekit expects project root
const originalCwd = process.cwd();
let changedCwd = false;
if (originalCwd !== dirname) {
	try {
		process.chdir(dirname);
		changedCwd = true;
	} catch (e) {
		// ignore if dirname is invalid or other issues, let it fail normally
	}
}

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const config = defineConfig({
	root: dirname,
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		conditions: ['monorepo-system-template']
	},
	test: {
		projects: [
			{
				extends: true,
				plugins: [
					// The plugin will run tests for the stories defined in your Storybook config
					// See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
					storybookTest({
						configDir: path.join(dirname, '.storybook')
					})
				],
				test: {
					name: 'storybook',
					browser: {
						enabled: true,
						headless: true,
						provider: playwright({}),
						instances: [
							{
								browser: 'chromium'
							}
						]
					},
					setupFiles: ['.storybook/vitest.setup.ts']
				}
			}
		]
	}
});

if (changedCwd) {
	process.chdir(originalCwd);
}

export default config;

