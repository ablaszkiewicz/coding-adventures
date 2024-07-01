import { ObjectOnScene } from "./store";

interface Params {
    objectsOnScene: ObjectOnScene[];
    samples: number;
    bounces: number;
    x: number;
    y: number;
    size: number;
    id: string;
}
export const getPartOfImageDataWithRetriesWithExponentialBackoff = async (
    params: Params
): Promise<number[]> => {
    // timeout after
    let retries = 0;
    let delay = 2 ** retries * 1000;

    while (retries < 5) {
        try {
            return await getPartOfImageData(params);
        } catch (e) {
            console.log("NEXT RETRY");
            retries++;
            delay = 2 ** retries * 1000;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    return [];
};

export const getPartOfImageData = async (params: Params): Promise<number[]> => {
    const response = await fetch(
        "https://ej9b6twj4f.execute-api.eu-central-1.amazonaws.com/dev/render",
        // "http://localhost:3000/dev/render",
        {
            method: "POST",
            body: JSON.stringify({
                objects: params.objectsOnScene,
                options: {
                    samples: params.samples,
                    bounces: params.bounces,
                    areaToRender: {
                        xMin: params.x * params.size,
                        xMax: params.x * params.size + params.size,
                        yMin: params.y * params.size,
                        yMax: params.y * params.size + params.size,
                    },
                    size: params.size,
                },
                frontendAssignedId: params.id,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    const data: number[] = await response.json();

    return data;
};
