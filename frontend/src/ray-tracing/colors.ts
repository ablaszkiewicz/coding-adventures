import { Vector3 } from "./engine/vector3";

export const colorsToVector = {
    Red: new Vector3(1, 0, 0),
    Green: new Vector3(0, 1, 0),
    Blue: new Vector3(0, 0, 1),
    White: new Vector3(1, 1, 1),
    Purple: new Vector3(1, 0, 1),
    Cyan: new Vector3(0, 1, 1),
    Yellow: new Vector3(1, 1, 0),
    Gray: new Vector3(0.7, 0.7, 0.7),
};

export const vectorToColor = (vector: Vector3) => {
    for (const [key, value] of Object.entries(colorsToVector)) {
        if (value.equals(vector)) {
            return key;
        }
    }
};

export const listOfColors = Object.keys(colorsToVector);
