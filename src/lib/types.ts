/* eslint-disable @typescript-eslint/no-explicit-any */

export type TLens = {
    id: string;
    groupId: string;
    name: string;
    iconUrl: string;
    preview: {
        imageUrl: string;
    }
    vendorData: any;
    cameraFacingPreference: number;
    lensCreator: {
        displayName: string | null;
    }
    snapcode: {
        imageUrl: string;
        deepLink: string;
    }
    featireMetadata: any
}
