import { Canvas } from "@react-three/fiber";
import { Sphere } from "./Sphere";
import { SceneSetup } from "./SceneSetup";
import { Vector3 } from "../vector3";

interface Props {
    onPositionChange: (position: Vector3) => void;
}

export const MyCanvas = (props: Props) => {
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
            <Sphere onPositionChange={props.onPositionChange} />
        </Canvas>
    );
};
