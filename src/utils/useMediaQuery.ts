import { onMount } from 'svelte';
import { writable } from 'svelte/store';

type MediaQueryStore = {
    subscribe: (run: (value: boolean) => void) => () => void;
};

export function useMediaQuery(query: string): MediaQueryStore {
    const matches = writable(false);

    const updateMatches = (media: MediaQueryList) => {
        matches.set(media.matches);
    };

    onMount(() => {
        const media = window.matchMedia(query);
        updateMatches(media);

        const listener = () => updateMatches(media);
        media.addEventListener('change', listener);

        return () => {
            media.removeEventListener('change', listener);
        };
    });

    return matches;
}