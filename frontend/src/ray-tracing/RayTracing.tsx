import { Button, Flex, Progress, Text } from "@chakra-ui/react";
import { ColumnEntry } from "../shared/ColumnEntry";
import { MasterColumn } from "../shared/MasterColumn";
import { useEffect, useRef, useState } from "react";
import { MyCanvas } from "./controls/MyCanvas";
import { Vector3 } from "./vector3";
import { MessageToWorker } from "./worker";

const worker = new Worker(new URL("./worker.ts", import.meta.url), {
    type: "module",
});

export const RayTracing = () => {
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [position, setPosition] = useState(new Vector3(0, 0, -1));

    useEffect(() => {
        if (initialized) {
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

        render();
        setInitialized(true);
        clear();
    }, [canvasRef.current]);

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
            objectsPositions: [position],
        };
        worker.postMessage(messageToWorker);
    };

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
            <Flex flexDir={"column"} alignItems={"center"}>
                <canvas
                    ref={canvasRef}
                    id="canvas"
                    width="800"
                    height="450"
                ></canvas>
                <MyCanvas onPositionChange={(p) => setPosition(p)} />
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
            </MasterColumn>
        </Flex>
    );
};
