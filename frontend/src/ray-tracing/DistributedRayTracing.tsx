import {
    Button,
    Flex,
    Link,
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
import { constructImageDataFromPlainArray } from "./helpers";
import { getCreditsCount, getPartOfImageDataWithRetries } from "./client";
import ObjectID from "bson-objectid";

export const DistributedRayTracing = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { objectsOnScene, addNew, randomizeScene, clearScene } =
        useRayTracingStore();

    // rendering
    const [worker, setWorker] = useState(
        new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })
    );
    const [loading, setLoading] = useState(false);
    const [credits, setCredits] = useState(0);

    // properties
    const [samples, setSamples] = useState(1);
    const [bounces, setBounces] = useState(20);
    const [chunkSize, setChunkSize] = useState(100);

    useEffect(() => {
        clear();
        refreshCredits();
    }, []);

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
    };

    const render = async () => {
        void refreshCredits();

        clear();
        setLoading(true);
        const id = new ObjectID().toHexString();

        const width = 800;

        const xParts = Math.ceil(width / chunkSize);
        const yParts = Math.ceil(450 / chunkSize);

        const promises = [];
        for (let x = 0; x < xParts; x++) {
            for (let y = 0; y < yParts; y++) {
                promises.push(paintPart(x, y, chunkSize, id));
            }
        }
        await Promise.all(promises);

        setLoading(false);
        void refreshCredits();
    };

    const paintPart = async (
        x: number,
        y: number,
        size: number,
        id: string
    ) => {
        const plainColorsArray = await getPartOfImageDataWithRetries({
            bounces,
            samples,
            objectsOnScene,
            size,
            x: x,
            y: y,
            id,
        });

        const imageData = constructImageDataFromPlainArray(
            plainColorsArray,
            size,
            size
        );

        canvasRef
            .current!.getContext("2d")!
            .putImageData(imageData, x * size, y * size);
    };

    const refreshCredits = async () => {
        setCredits(await getCreditsCount());
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
                <ColumnEntry title={`Rendering`}>
                    <Flex width={"100%"} gap={4}>
                        <Tooltip
                            label={
                                "This number represents remaining credits. Each render costs 1 credit. There is a shared pool of credits for all users - 100 credits per 24h"
                            }
                        >
                            <Tag
                                flexShrink={0}
                                variant={"outline"}
                                cursor={"pointer"}
                            >
                                {credits}
                            </Tag>
                        </Tooltip>
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
                    <SliderWithValue
                        title="Chunk size"
                        min={20}
                        max={samples > 300 ? 50 : 100}
                        value={chunkSize}
                        setValue={setChunkSize}
                        tooltip="How big area is rendered in one chunk."
                    />
                </ColumnEntry>
                <ColumnEntry title="Renderer options">
                    <SliderWithValue
                        title="Number of samples per pixel"
                        min={1}
                        max={500}
                        value={samples}
                        setValue={(value) => {
                            if (value > 300 && chunkSize > 50) {
                                setChunkSize(50);
                            }
                            setSamples(value);
                        }}
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
