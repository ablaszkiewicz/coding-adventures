import { Button, Flex, Progress, Text } from "@chakra-ui/react";
import { ColumnEntry } from "../shared/ColumnEntry";
import { MasterColumn } from "../shared/MasterColumn";
import { useEffect, useRef, useState } from "react";
import { MyCanvas } from "./controls/MyCanvas";
import { Vector3 } from "./vector3";
import { MessageToWorker } from "./worker";
import { SliderWithValue } from "../shared/SliderWithValue";

const worker = new Worker(new URL("./worker.ts", import.meta.url), {
    type: "module",
});

export const RayTracing = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // rendering
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [canvasInitialized, setCanvasInitialized] = useState(false);
    const [renderInitialized, setRenderInitialized] = useState(false);

    // positions
    const [positions, setPositions] = useState<Vector3[]>([]);

    // properties
    const [samples, setSamples] = useState(5);
    const [bounces, setBounces] = useState(20);

    useEffect(() => {
        if (canvasInitialized) {
            return;
        }
        const canvas = canvasRef.current!;

        worker.onmessage = (e) => {
            if (e.data.status === "progress") {
                setProgress(e.data.data);
                return;
            }

            if (e.data.status === "done") {
                canvas.getContext("2d")!.putImageData(e.data.data, 0, 0);
                setLoading(false);
            }
        };

        clear();

        setCanvasInitialized(true);
    }, [canvasRef.current]);

    useEffect(() => {
        if (!positions.length || renderInitialized) {
            return;
        }

        setRenderInitialized(true);
        render();
    }, [positions]);

    const clear = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setProgress(0);
    };

    const render = () => {
        setLoading(true);

        const messageToWorker: MessageToWorker = {
            objectsPositions: positions,
            options: {
                bounces,
                samples,
            },
        };

        worker.postMessage(messageToWorker);
    };

    const trySetPositions = (positions: Vector3[]) => {
        if (positions.some((p) => p.x === 0 && p.y === 0 && p.z === 0)) {
            return;
        }

        setPositions(positions);
    };

    return (
        <Flex
            flexDir={"row"}
            w={"100vw"}
            h={"100vh"}
            m={0}
            p={10}
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
            <Flex flexDir={"column"} alignItems={"center"} gap={4}>
                <Flex
                    direction={"column"}
                    alignItems={"center"}
                    backgroundColor={"gray.800"}
                    p={4}
                    borderRadius={10}
                >
                    <canvas
                        ref={canvasRef}
                        id="canvas"
                        width="800"
                        height="450"
                    ></canvas>
                </Flex>
                <Flex
                    direction={"column"}
                    alignItems={"center"}
                    backgroundColor={"gray.800"}
                    borderRadius={10}
                    w={"100%"}
                    h={"100%"}
                >
                    <MyCanvas onPositionsChange={trySetPositions} />
                </Flex>
            </Flex>
            <MasterColumn>
                <ColumnEntry title="Rendering">
                    <Flex width={"100%"} gap={4}>
                        <Button
                            onClick={() => render()}
                            isLoading={loading}
                            w={"100%"}
                        >
                            Render
                        </Button>
                        <Button onClick={() => clear()} w={"100%"}>
                            Clear
                        </Button>
                    </Flex>
                    <Progress
                        value={progress}
                        max={100}
                        colorScheme="blue"
                        borderRadius={5}
                    />
                </ColumnEntry>
                <ColumnEntry title="Renderer options">
                    <SliderWithValue
                        title="Number of samples per pixel"
                        min={1}
                        max={500}
                        value={samples}
                        setValue={setSamples}
                    />
                    <SliderWithValue
                        title="Maximum number of bounces per ray"
                        min={1}
                        max={50}
                        value={bounces}
                        setValue={setBounces}
                    />
                </ColumnEntry>
            </MasterColumn>
        </Flex>
    );
};
