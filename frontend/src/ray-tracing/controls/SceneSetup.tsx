import {
    Box,
    GizmoHelper,
    GizmoViewport,
    OrbitControls,
    Text3D,
} from "@react-three/drei";

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

            <Text3D
                font={"coding-adventures/gt.json"}
                scale={0.2}
                rotation={[0, Math.PI / 2, 0]}
                position={[-1, 0, 0.6]}
            >
                Camera
            </Text3D>

            <Box position={[-1, 0.1, 0]} scale={[0.5, 0.5, 2]}>
                <meshStandardMaterial wireframe />
            </Box>

            <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
                <GizmoViewport labelColor="white" axisHeadScale={1} />
            </GizmoHelper>
            <OrbitControls makeDefault target={[3, -1, 0]} />
        </>
    );
};
