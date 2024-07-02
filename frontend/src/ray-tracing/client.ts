import { ObjectOnScene } from "./store";

const BASE_URL =
    "https://nc9fmi3uo2.execute-api.eu-central-1.amazonaws.com/dev";
// const BASE_URL = "http://localhost:3000";

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
            retries++;
            delay = 2 ** retries * 500;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    return [];
};

export const getPartOfImageData = async (params: Params): Promise<number[]> => {
    const response = await fetch(
        `${BASE_URL}/render`,
        // "http://localhost:3000/render",
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

    if (response.status !== 201) {
        throw new Error("No data");
    }

    const data: number[] = await response.json();

    return data;
};
