import { PivotControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Vector3 as ThreeVector3 } from "three";

interface Props {
    name: string;
    initialPosition: ThreeVector3;
    onPositionChange: (name: string, position: ThreeVector3) => void;
}

export const Sphere = (props: Props) => {
    const [initialPosition, setInitialPosition] = useState([0, 0, 0]);
    const thisObject = useRef();

    useEffect(() => {
        setInitialPosition([
            props.initialPosition.x,
            props.initialPosition.y,
            props.initialPosition.z,
        ]);
    }, []);

    useEffect(() => {
        if (!thisObject.current) return;

        propagatePositionChange();
    }, [thisObject.current]);

    const propagatePositionChange = () => {
        const threePosition = (thisObject.current as any).getWorldPosition(
            new THREE.Vector3()
        );

        props.onPositionChange(props.name, threePosition);
    };

    return (
        <group scale={0.5} position={initialPosition as any}>
            <PivotControls
                disableRotations
                disableScaling
                onDrag={propagatePositionChange}
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
