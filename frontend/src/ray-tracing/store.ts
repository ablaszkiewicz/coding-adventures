import { Vector3 as ThreeVector3 } from "three";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Vector3 as MyVector3 } from "./engine/vector3";
import { MaterialType } from "./engine/materials/material";
import { randomNumberBetweem } from "./engine/utils";
import { colorsToVector, listOfColors } from "./colors";

export interface ObjectOnScene {
    name: string;
    position: ThreeVector3;
    color: MyVector3;
    material: MaterialType;
    scale: number;
}

interface RayTracingState {
    objectsOnScene: ObjectOnScene[];
    removeObject: (name: string) => void;
    updatePosition: (name: string, position: ThreeVector3) => void;
    updateMaterial: (name: string, material: MaterialType) => void;
    updateColor: (name: string, color: MyVector3) => void;
    setObjectsOnScene: (objects: ObjectOnScene[]) => void;
    addNew: () => void;
    addNewRandom: () => void;
    randomizeScene: () => void;
    clearScene: () => void;
}

export const useRayTracingStore = create<RayTracingState>()(
    devtools(
        (set) => ({
            objectsOnScene: [
                {
                    name: "Sphere1",
                    position: new ThreeVector3(1, 0, -1),
                    color: new MyVector3(1, 0, 0),
                    material: MaterialType.Lambertian,
                    scale: 0.5,
                },
                {
                    name: "Sphere2",
                    position: new ThreeVector3(3, 1, 0),
                    color: new MyVector3(0.6, 0.6, 0.6),
                    material: MaterialType.Metal,
                    scale: 1,
                },
                {
                    name: "Sphere3",
                    position: new ThreeVector3(1, 0, 1),
                    color: new MyVector3(0, 0, 1),
                    material: MaterialType.Lambertian,
                    scale: 0.5,
                },
            ],
            removeObject: (name: string) =>
                set((state) => ({
                    objectsOnScene: state.objectsOnScene.filter(
                        (object) => object.name !== name
                    ),
                })),
            updatePosition: (name: string, position: ThreeVector3) =>
                set((state) => ({
                    objectsOnScene: state.objectsOnScene.map((object) =>
                        object.name === name ? { ...object, position } : object
                    ),
                })),
            updateMaterial: (name: string, material: MaterialType) =>
                set((state) => ({
                    objectsOnScene: state.objectsOnScene.map((object) =>
                        object.name === name ? { ...object, material } : object
                    ),
                })),
            updateColor: (name: string, color: MyVector3) =>
                set((state) => ({
                    objectsOnScene: state.objectsOnScene.map((object) =>
                        object.name === name ? { ...object, color } : object
                    ),
                })),
            setObjectsOnScene: (objects: ObjectOnScene[]) =>
                set(() => ({
                    objectsOnScene: objects,
                })),
            addNew: () =>
                set((state) => ({
                    objectsOnScene: [
                        ...state.objectsOnScene,
                        {
                            name: getNextName(state.objectsOnScene),
                            position: new ThreeVector3(1, 0, 0),
                            color: new MyVector3(1, 1, 1),
                            material: MaterialType.Lambertian,
                            scale: 0.5,
                        },
                    ],
                })),
            addNewRandom: () =>
                set((state) => ({
                    objectsOnScene: [
                        ...state.objectsOnScene,
                        getRandomObjectOnScene(state.objectsOnScene),
                    ],
                })),
            randomizeScene: () =>
                set(() => ({
                    objectsOnScene: getRandomObjectsOnScene(30),
                })),
            clearScene: () =>
                set(() => ({
                    objectsOnScene: [],
                })),
        }),
        {
            name: "ray-tracer-storage",
        }
    )
);

export const getNextName = (objects: ObjectOnScene[]): string => {
    if (objects.length === 0) return "Sphere1";

    return `Sphere${
        Number(objects[objects.length - 1].name.split("re")[1]) + 1
    }`;
};

export const getRandomObjectsOnScene = (amount: number): ObjectOnScene[] => {
    const objectsOnScene: ObjectOnScene[] = [];

    for (let i = 0; i < amount; i++) {
        objectsOnScene.push(getRandomObjectOnScene(objectsOnScene));
    }

    return objectsOnScene;
};

export const getRandomObjectOnScene = (
    objects: ObjectOnScene[]
): ObjectOnScene => {
    const randomScale = randomNumberBetweem(0.2, 2);

    const position = new ThreeVector3(
        randomNumberBetweem(3, 10),
        randomNumberBetweem(0, 3),
        randomNumberBetweem(-10, 10)
    );

    const randomMaterial =
        Math.random() > 0.2 ? MaterialType.Lambertian : MaterialType.Metal;

    const randomColor =
        randomMaterial === MaterialType.Metal
            ? "Gray"
            : listOfColors[Math.floor(Math.random() * listOfColors.length)];

    return {
        name: getNextName(objects),
        position,
        color: colorsToVector[randomColor as keyof typeof colorsToVector],
        material: randomMaterial,
        scale: randomScale,
    };
};
