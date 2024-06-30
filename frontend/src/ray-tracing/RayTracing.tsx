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
import { MessageToWorker } from "./worker";
import { SliderWithValue } from "../shared/SliderWithValue";
import { useRayTracingStore } from "./store";
import { ObjectOnSceneListItem } from "./ObjectOnSceneListItem";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export const RayTracing = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { objectsOnScene, addNew } = useRayTracingStore();

    // rendering
    const [worker, setWorker] = useState(
        new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })
    );
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    // properties
    const [samples, setSamples] = useState(5);
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

    const render = () => {
        setLoading(true);

        const messageToWorker: MessageToWorker = {
            objects: objectsOnScene,
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
                        Ray tracing is a technique used in computer graphics to
                        create realistic images by simulating how rays of light
                        interact with objects in a scene.
                        <br />
                        Think of rays as imaginary lines that are traced from
                        your eyes (or a virtual camera) into the scene you want
                        to draw.
                        <br />
                        <br />
                        What you see here is a demo of a ray tracer written in
                        pure TypeScript from scratch without any external
                        libraries.
                        <br />
                        <br />
                        In the top window there is a render output of the ray
                        tracer I have written.
                        <br />
                        <br />
                        In the bottom window you can see a live editor where you
                        can add objects to the scene and see how they will look
                        in the rendered image. It was created thanks to awesome
                        packages from{" "}
                        <Link
                            color={"blue.400"}
                            href="https://github.com/pmndrs"
                            isExternal
                        >
                            poimandres <ExternalLinkIcon mx="2px" />
                        </Link>
                        <br />
                        <br />
                        Based on{" "}
                        <Link
                            color={"blue.400"}
                            href="https://raytracing.github.io/books/RayTracingInOneWeekend.html"
                            isExternal
                        >
                            ray tracing in one weekend{" "}
                            <ExternalLinkIcon mx="2px" />
                        </Link>
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
                    customButton={{ title: "Add", onClick: () => addNew() }}
                >
                    <Flex
                        direction={"column"}
                        p={2}
                        backgroundColor={"gray.900"}
                        borderRadius={10}
                        gap={2}
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
