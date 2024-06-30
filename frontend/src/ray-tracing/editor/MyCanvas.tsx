import { Canvas } from "@react-three/fiber";
import { Sphere } from "./Sphere";
import { SceneSetup } from "./SceneSetup";
import { useRayTracingStore } from "../store";

export const MyCanvas = () => {
    const { objectsOnScene } = useRayTracingStore();

    return (
        <Canvas
            shadows
            camera={{
                position: [-6, 3, 0],
                fov: 20,
                rotation: [0, -Math.PI / 2, 0],
            }}
        >
            <SceneSetup />
            {objectsOnScene.map((object) => (
                <Sphere
                    key={object.id}
                    name={object.name}
                    initialPosition={object.position}
                />
            ))}
        </Canvas>
    );
};
