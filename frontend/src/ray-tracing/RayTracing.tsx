import { Button, Flex, Text } from "@chakra-ui/react";
import { ColumnEntry } from "../shared/ColumnEntry";
import { MasterColumn } from "../shared/MasterColumn";
import { useEffect, useRef, useState } from "react";
import { RayTracer } from "./ray-tracer";

export interface Props {
    engine: Engine;
    numberOfParticles: number;
    sizeOfParticles: number;
    visualizeBoundaries: boolean;
    maxParticlesPerCell: number;
    visualizeParticleBoundaries: boolean;
}

export enum Engine {
    Classic = "Classic",
    Quad = "Quad",
}

export const RayTracing = () => {
    const [rayTracer, setRayTracer] = useState<RayTracer | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const rayTracer = new RayTracer(canvas.getContext("2d")!);
        rayTracer.render();
        setRayTracer(rayTracer);
    }, [canvasRef.current]);

    return (
        <Flex
            flexDir={"row"}
            w={"100vw"}
            h={"100vh"}
            m={0}
            p={20}
            backgroundColor={"gray.900"}
            gap={8}
        >
            <MasterColumn>
                <ColumnEntry title="Ray Tracing" previousLocation="/">
                    <Text opacity={0.6} fontWeight={"light"}>
                        Ebebebebe
                    </Text>
                </ColumnEntry>
            </MasterColumn>
            <Flex
                flexDir={"column"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <canvas
                    ref={canvasRef}
                    id="canvas"
                    width="800"
                    height="800"
                ></canvas>
            </Flex>
            <MasterColumn>
                <ColumnEntry title="Options">
                    <Button onClick={() => rayTracer?.render()}>Render</Button>
                    <Button onClick={() => rayTracer?.clear()}>Clear</Button>
                </ColumnEntry>
            </MasterColumn>
        </Flex>
    );
};
