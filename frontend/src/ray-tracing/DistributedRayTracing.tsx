import {
    Button,
    Flex,
    Link,
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
import { SliderWithValue } from "../shared/SliderWithValue";
import { useRayTracingStore } from "./store";
import { ObjectOnSceneListItem } from "./ObjectOnSceneListItem";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export const DistributedRayTracing = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { objectsOnScene, addNew, randomizeScene, clearScene } =
        useRayTracingStore();

    // rendering
    const [worker, setWorker] = useState(
        new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })
    );
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    // properties
    const [samples, setSamples] = useState(100);
    const [bounces, setBounces] = useState(20);

    useEffect(() => {
        clear();
    }, []);

    useEffect(() => {
        if (!worker) {
            return;
        }

        worker.onmessage = (e) => {
            if (e.data.status === "progress") {
                setProgress(e.data.data);
                return;
            }

            const canvas = canvasRef.current!;

            if (e.data.status === "done") {
                canvas.getContext("2d")!.putImageData(e.data.data, 0, 0);
                setLoading(false);
            }
        };

        return () => {
            worker.removeEventListener("message", () => {});
        };
    }, [worker]);

    useEffect(() => {
        setTimeout(() => {
            render();
        }, 500);
    }, []);

    const cancel = () => {
        worker.terminate();
        setLoading(false);
        setWorker(
            new Worker(new URL("./worker.ts", import.meta.url), {
                type: "module",
            })
        );
    };

    const clear = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setProgress(0);
    };

    const render = async () => {
        setLoading(true);

        for (let i = 0; i < 8; i++) {
            const promises = [];
            for (let j = 0; j < 5; j++) {
                promises.push(paintPart(i, j));
            }

            await Promise.all(promises);
        }

        setLoading(false);
    };

    const paintPart = async (i: number, j: number) => {
        console.log("Before");

        const response = await (
            await fetch("http://localhost:3000/render", {
                method: "POST",
                body: JSON.stringify({
                    objects: objectsOnScene,
                    options: {
                        samples: samples,
                        bounces: bounces,
                        areaToRender: {
                            xMin: i * 100,
                            xMax: i * 100 + 100,
                            yMin: j * 100,
                            yMax: j * 100 + 100,
                        },
                    },
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
        ).json();

        console.log("Painting");
        console.log(response.length / 4);

        const imageData = new ImageData(100, 100);

        for (let k = 0; k < 100 * 100 * 4; k++) {
            imageData.data[k] = response[k];
        }

        canvasRef
            .current!.getContext("2d")!
            .putImageData(imageData, i * 100, j * 100);
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
            overflow={"hidden"}
        >
            <MasterColumn>
                <ColumnEntry
                    title="Distributed ray Tracing"
                    previousLocation="/"
                >
                    <Text opacity={0.6} fontWeight={"light"}>
                        If you haven't, I highly encourage you to see browser
                        version of this ray tracer available{" "}
                        <Link
                            color={"blue.400"}
                            href="https://ablaszkiewicz.github.io/coding-adventures/#/ray-tracing"
                            isExternal
                        >
                            here <ExternalLinkIcon mx="2px" />
                        </Link>
                        <br />
                        <br />
                        This ray tracer works in a distributed way by splitting
                        the image into parts and invoking lambda functions
                    </Text>
                </ColumnEntry>
                <ColumnEntry title="Actions">
                    <Flex flexDir={"column"} gap={4} mt={4}>
                        <Button
                            onClick={() => {
                                randomizeScene();
                            }}
                        >
                            Randomize scene
                        </Button>
                        <Button
                            onClick={() => {
                                clearScene();
                            }}
                        >
                            Clear scene
                        </Button>
                    </Flex>
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
                        <Button
                            isDisabled={!loading}
                            onClick={() => cancel()}
                            w={"100%"}
                        >
                            Cancel
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
                        tooltip="Higher number of samples will result in smoother image but will take longer to render."
                    />
                    <SliderWithValue
                        title="Maximum number of bounces per ray"
                        min={1}
                        max={50}
                        value={bounces}
                        setValue={setBounces}
                        tooltip="Limits how many times can ray bounce off objects before it is considered as 'lost'. 0 will result in black image because rays can't bounce. 1 will result in only seeing black shapes because rays don't bounce off objects. Higher number will result in more realistic image but will take longer to render. For standard materials anything above 5 makes little to no difference."
                    />
                </ColumnEntry>
                <ColumnEntry
                    title="Objects on scene"
                    customButton={{
                        title: "Add",
                        onClick: () => addNew(),
                    }}
                    canShrink
                >
                    <Flex
                        direction={"column"}
                        p={2}
                        backgroundColor={"gray.900"}
                        borderRadius={10}
                        gap={2}
                        overflowY={"auto"}
                    >
                        {objectsOnScene.map((o) => (
                            <ObjectOnSceneListItem key={o.name} object={o} />
                        ))}
                    </Flex>
                </ColumnEntry>
            </MasterColumn>
        </Flex>
    );
};
