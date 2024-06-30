import { Vector3 as ThreeVector3 } from "three";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Vector3 as MyVector3 } from "./engine/vector3";
import { MaterialType } from "./engine/materials/material";

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
}

export const useRayTracingStore = create<RayTracingState>()(
    devtools(
        (set) => ({
            objectsOnScene: [
                {
                    name: "object1",
                    position: new ThreeVector3(1, 0, -1),
                    color: new MyVector3(1, 0, 0),
                    material: MaterialType.Lambertian,
                    scale: 0.5,
                },
                {
                    name: "object2",
                    position: new ThreeVector3(7, 1, 0),
                    color: new MyVector3(0.6, 0.6, 0.6),
                    material: MaterialType.Metal,
                    scale: 3,
                },
                {
                    name: "object3",
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
                            name: `object${
                                Number(
                                    state.objectsOnScene[
                                        state.objectsOnScene.length - 1
                                    ].name.split("t")[1]
                                ) + 1
                            }`,
                            position: new ThreeVector3(1, 0, 0),
                            color: new MyVector3(1, 1, 1),
                            material: MaterialType.Lambertian,
                            scale: 0.5,
                        },
                    ],
                })),
        }),
        {
            name: "ray-tracer-storage",
        }
    )
);
