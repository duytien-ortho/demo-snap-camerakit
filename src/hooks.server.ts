import type { HandleFetch } from '@sveltejs/kit';

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
    if (request.url.startsWith('https://core-dev.ortho.fashion/api/v1')) {
        // clone the original request, but change the URL
        request = new Request(
            request.url.replace('https://core-dev.ortho.fashion/api/v1', 'http://localhost:9999/'),
            request,
        );
    }

    return fetch(request);
};