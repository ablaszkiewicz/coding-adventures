import { Vector3 as ThreeVector3 } from "three";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface ObjectOnScene {
    name: string;
    position: ThreeVector3;
}

interface RayTracingState {
    objectsOnScene: ObjectOnScene[];
    removeObject: (name: string) => void;
    updatePosition: (name: string, position: ThreeVector3) => void;
    setObjectsOnScene: (objects: ObjectOnScene[]) => void;
    addNew: () => void;
}

export const useRayTracingStore = create<RayTracingState>()(
    devtools(
        persist(
            (set) => ({
                objectsOnScene: [],
                removeObject: (name: string) =>
                    set((state) => ({
                        objectsOnScene: state.objectsOnScene.filter(
                            (object) => object.name !== name
                        ),
                    })),
                updatePosition: (name: string, position: ThreeVector3) =>
                    set((state) => ({
                        objectsOnScene: state.objectsOnScene.map((object) =>
                            object.name === name
                                ? { ...object, position }
                                : object
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
                                position: new ThreeVector3(1, 1, 0),
                            },
                        ],
                    })),
            }),
            {
                name: "ray-tracer-storage",
            }
        )
    )
);
