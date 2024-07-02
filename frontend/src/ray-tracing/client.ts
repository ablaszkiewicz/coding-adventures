import { ObjectOnScene } from "./store";

const CREDITS_BASE_URL =
    "https://nes0jmqf8j.execute-api.eu-central-1.amazonaws.com/dev";
const UNIT_BASE_URL =
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

const randomBetween = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min);

export const getPartOfImageDataWithRetries = async (
    params: Params
): Promise<number[]> => {
    // timeout after
    let retries = 0;
    const delay = randomBetween(500, 5_000);

    while (retries < 5) {
        try {
            return await getPartOfImageData(params);
        } catch (e) {
            retries++;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    return [];
};

export const getPartOfImageData = async (params: Params): Promise<number[]> => {
    const response = await fetch(
        `${UNIT_BASE_URL}/render`,
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

export const getCreditsCount = async (): Promise<number> => {
    const response = await fetch(`${CREDITS_BASE_URL}/credits`);
    const data = await response.json();

    return data.count;
};
