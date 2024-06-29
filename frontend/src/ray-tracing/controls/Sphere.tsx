import { PivotControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Vector3 } from "../vector3";

interface Props {
    onPositionChange: (position: Vector3) => void;
}

export const Sphere = (props: Props) => {
    const thisObject = useRef();

    useEffect(() => {
        if (!thisObject.current) return;

        calculate();
    }, [thisObject.current]);

    const calculate = () => {
        const threePosition = (thisObject.current as any).getWorldPosition(
            new THREE.Vector3()
        );

        const myPosition = new Vector3(
            threePosition.z,
            threePosition.y,
            -threePosition.x
        );

        props.onPositionChange(myPosition);
    };

    return (
        <group scale={0.5} position={[1, 0, 0]}>
            <PivotControls
                disableRotations
                disableScaling
                onDrag={calculate}
                ref={thisObject as any}
            >
                <mesh castShadow receiveShadow>
                    <sphereGeometry args={[1]} />
                    <meshStandardMaterial color="white" />
                </mesh>
            </PivotControls>
        </group>
    );
};
