import {
    Button,
    Flex,
    Progress,
    Spacer,
    Tag,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import { ColumnEntry } from "../shared/ColumnEntry";
import { MasterColumn } from "../shared/MasterColumn";
import { useEffect, useRef, useState } from "react";
import { MyCanvas } from "./editor/MyCanvas";
import { MessageToWorker } from "./worker";
import { SliderWithValue } from "../shared/SliderWithValue";
import { useRayTracingStore } from "./store";
import { Vector3 } from "three";
import { ObjectOnSceneListItem } from "./ObjectOnSceneListItem";

const worker = new Worker(new URL("./worker.ts", import.meta.url), {
    type: "module",
});

export const RayTracing = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { objectsOnScene, setObjectsOnScene, addNew } = useRayTracingStore();

    // rendering
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [canvasInitialized, setCanvasInitialized] = useState(false);

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

        setObjectsOnScene([
            {
                name: "object1",
                position: new Vector3(1, 0, -1),
            },
            {
                name: "object2",
                position: new Vector3(1, 0, 0),
            },
            {
                name: "object3",
                position: new Vector3(1, 0, 1),
            },
        ]);
    }, [canvasRef.current]);

    useEffect(() => {
        setTimeout(() => {
            render();
        }, 200);
    }, []);

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
            objectsPositions: objectsOnScene.map((o) => o.position),
            options: {
                bounces,
                samples,
            },
        };

        worker.postMessage(messageToWorker);
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
                    position={"relative"}
                >
                    <Flex
                        direction={"row"}
                        position={"absolute"}
                        w={"100%"}
                        p={4}
                    >
                        <Spacer />
                        <Tooltip
                            label={
                                "This is live editor. Use LEFT MOUSE to rotate camera. RIGHT MOUSE to move camera. SCROLL to zoom. Whatever you do in live editor will be reflected on the rendered image after pressing 'Render' button"
                            }
                        >
                            <Tag zIndex={1000} cursor={"pointer"}>
                                Hover me
                            </Tag>
                        </Tooltip>
                    </Flex>
                    <MyCanvas />
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
                <ColumnEntry
                    title="Objects on scene"
                    customButton={{ title: "Add", onClick: () => addNew() }}
                >
                    <Flex
                        direction={"column"}
                        p={4}
                        backgroundColor={"gray.900"}
                        borderRadius={10}
                        gap={4}
                    >
                        {objectsOnScene.map((o) => (
                            <ObjectOnSceneListItem object={o} />
                        ))}
                    </Flex>
                </ColumnEntry>
            </MasterColumn>
        </Flex>
    );
};
