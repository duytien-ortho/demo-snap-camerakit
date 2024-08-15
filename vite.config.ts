import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import mkcert from 'vite-plugin-mkcert'

// import fs from 'fs';
// import path from 'path';

export default defineConfig({
	plugins: [sveltekit(), mkcert()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		// https: {
		// 	key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost+2-key.pem')),
		// 	cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost+2.pem')),
		// }
	}
});
