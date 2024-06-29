import { Canvas } from "@react-three/fiber";
import { Sphere } from "./Sphere";
import { SceneSetup, threeVectorToMyVector3 } from "./SceneSetup";
import { Vector3 as MyVector3 } from "../vector3";
import { useEffect, useState } from "react";
import { Vector3 as ThreeVector3 } from "three";

interface Props {
    onPositionsChange: (positions: MyVector3[]) => void;
}

export const MyCanvas = (props: Props) => {
    const sphereNames = ["a", "b", "c"];
    const [positions, setPositions] = useState<Record<string, ThreeVector3>>({
        a: new ThreeVector3(1, 0, -1),
        b: new ThreeVector3(1, 0, 0),
        c: new ThreeVector3(1, 0, 1),
    });

    useEffect(() => {
        props.onPositionsChange(
            Object.values(positions).map((p) => threeVectorToMyVector3(p))
        );
    }, []);

    const updatePosition = (name: string, position: ThreeVector3) => {
        const newPositions = {
            ...positions,
            [name]: position,
        };

        setPositions(newPositions);

        props.onPositionsChange(
            Object.values(positions).map((p) => threeVectorToMyVector3(p))
        );
    };

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
            {sphereNames.map((name) => (
                <Sphere
                    key={name}
                    name={name}
                    onPositionChange={updatePosition}
                    initialPosition={positions[name]}
                />
            ))}
        </Canvas>
    );
};
