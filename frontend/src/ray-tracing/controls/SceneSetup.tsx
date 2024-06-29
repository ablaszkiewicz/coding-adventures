import { GizmoHelper, GizmoViewport, OrbitControls } from "@react-three/drei";

export const SceneSetup = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight
                castShadow
                position={[0, 5, 0]}
                intensity={1.5}
                shadow-mapSize={[1024, 1024]}
            />

            <mesh
                scale={20}
                receiveShadow
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.5, 0]}
            >
                <planeGeometry />
                <shadowMaterial transparent opacity={0.5} />
            </mesh>

            <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
                <GizmoViewport labelColor="white" axisHeadScale={1} />
            </GizmoHelper>
            <OrbitControls makeDefault target={[3, -1, 0]} />
        </>
    );
};
