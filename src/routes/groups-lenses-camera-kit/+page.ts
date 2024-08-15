import { PUBLIC_API_BASE_URL } from "$env/static/public";
import type { PageData } from "../$types";

export const ssr = false;
export const csr = true;

export const load: PageData = async () => {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/collections/try-on`)
    const data = await res.json()

    return {
        collections: data?.data || []
    }
}