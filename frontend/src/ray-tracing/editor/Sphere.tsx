import { PivotControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Vector3 as ThreeVector3 } from "three";
import { useRayTracingStore } from "../store";

interface Props {
    name: string;
    initialPosition: ThreeVector3;
}

export const Sphere = (props: Props) => {
    const { updatePosition, objectsOnScene } = useRayTracingStore();
    const thisObjectFromStore = objectsOnScene.find(
        (object) => object.name === props.name
    );

    const [initialPosition, setInitialPosition] = useState([0, 0, 0]);
    const thisObject = useRef();

    useEffect(() => {
        setInitialPosition([
            props.initialPosition.x,
            props.initialPosition.y,
            props.initialPosition.z,
        ]);
    }, []);

    const propagatePositionChange = () => {
        const threePosition = (thisObject.current as any).getWorldPosition(
            new THREE.Vector3()
        );

        updatePosition(props.name, threePosition);
    };

    return (
        <group
            scale={thisObjectFromStore?.scale}
            position={initialPosition as any}
        >
            <PivotControls
                disableRotations
                disableScaling
                onDrag={propagatePositionChange}
                ref={thisObject as any}
                scale={thisObjectFromStore?.scale! * 2}
            >
                <mesh castShadow receiveShadow>
                    <sphereGeometry args={[1]} />
                    <meshStandardMaterial
                        color={
                            thisObjectFromStore
                                ? new THREE.Color(
                                      thisObjectFromStore.color.x,
                                      thisObjectFromStore.color.y,
                                      thisObjectFromStore.color.z
                                  )
                                : new THREE.Color(0, 0, 0)
                        }
                    />
                </mesh>
            </PivotControls>
        </group>
    );
};
