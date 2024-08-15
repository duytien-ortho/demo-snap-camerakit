// -- store for recording video --
import { writable } from "svelte/store";

// download url
export const videoUrl = createVideoStore();

function createVideoStore() {
    const { subscribe, set, update } = writable<string | null>(null);

    return {
        subscribe,
        set,
        update,
    };
}