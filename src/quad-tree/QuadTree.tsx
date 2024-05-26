import { Button, Flex, Link, Text } from "@chakra-ui/react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { useState } from "react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { ColumnEntry } from "../shared/ColumnEntry";
import { MasterColumn } from "../shared/MasterColumn";
import { Segmented } from "../shared/Segmented";
import { SegmentedYesNo } from "../shared/SegmentedYesNo";
import { SliderWithValue } from "../shared/SliderWithValue";
import { sketch } from "./p5/p5";

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

export const QuadTree = () => {
    const [numberOfParticles, setNumberOfParticles] = useState(100);
    const [sizeOfParticles, setSizeOfParticles] = useState(5);
    const [engine, setEngine] = useState<Engine>(Engine.Classic);
    const [visualizeBoundaries, setVisualizeBoundaries] = useState(false);
    const [maxParticlesPerCell, setMaxParticlesPerCell] = useState(4);
    const [visualizeParticleBoundaries, setVisualizeParticleBoundaries] =
        useState(false);

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
                <ColumnEntry title="Quad tree" previousLocation="/">
                    <Text opacity={0.6} fontWeight={"light"}>
                        Each particle collides with walls and with other
                        particles. Upon collision both particles flash white for
                        a moment. In the center there is a rectangular area
                        which detects particles inside and marks them green.
                        <br />
                        <br />
                        Below you can choose which algorithm is used to check
                        for collisions and intersections:
                        <br />- <b>classic search</b> - each particle checks
                        every other particle for collisions,
                        <br />- <b>quad tree</b> - a quad tree is built every
                        frame and particles query it to resolve collisions. Each
                        particle instead of checking every other particle, it
                        only checks small subset of particles (
                        <Link
                            color={"blue.400"}
                            href="https://en.wikipedia.org/wiki/Quadtree"
                            isExternal
                        >
                            quad tree wikipedia <ExternalLinkIcon mx="2px" />
                        </Link>
                        ).
                        <br />
                        <br />
                        If you don't want to play with these sliders and just
                        want to see something cool, there is a presets section
                        on the right which will tune the sliders for you.
                    </Text>
                </ColumnEntry>
                <ColumnEntry title="Interesting presets">
                    <Flex flexDir={"column"} gap={4} mt={4}>
                        <Button
                            onClick={() => {
                                setEngine(Engine.Quad);
                                setMaxParticlesPerCell(1);
                                setSizeOfParticles(5);
                                setNumberOfParticles(50);
                                setVisualizeBoundaries(true);
                                setVisualizeParticleBoundaries(false);
                            }}
                        >
                            Show me cool quad tree building process
                        </Button>
                        <Button
                            onClick={() => {
                                setEngine(Engine.Classic);
                                setSizeOfParticles(1);
                                setNumberOfParticles(2500);
                                setVisualizeParticleBoundaries(false);
                            }}
                        >
                            Show me how slow classic is
                        </Button>
                        <Button
                            onClick={() => {
                                setEngine(Engine.Quad);
                                setSizeOfParticles(1);
                                setNumberOfParticles(2500);
                                setMaxParticlesPerCell(4);
                                setVisualizeBoundaries(false);
                                setVisualizeParticleBoundaries(false);
                            }}
                        >
                            Show me how fast quad tree is
                        </Button>
                    </Flex>
                </ColumnEntry>
            </MasterColumn>
            <Flex
                flexDir={"column"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <ReactP5Wrapper
                    sketch={sketch}
                    props={{
                        engine,
                        numberOfParticles,
                        sizeOfParticles,
                        visualizeBoundaries,
                        maxParticlesPerCell,
                        visualizeParticleBoundaries,
                    }}
                />
            </Flex>
            <MasterColumn>
                <ColumnEntry title="Search options">
                    <Segmented
                        options={[Engine.Classic, Engine.Quad]}
                        onChange={(value) => setEngine(value as any)}
                        value={engine}
                        title={"Search algorithm"}
                    />

                    {engine === Engine.Quad && (
                        <>
                            <SegmentedYesNo
                                title="Show quad tree subdivisions"
                                value={visualizeBoundaries}
                                onChange={(value) =>
                                    setVisualizeBoundaries(value)
                                }
                            />
                            <SliderWithValue
                                title="Max particles per cell"
                                min={1}
                                max={30}
                                value={maxParticlesPerCell}
                                setValue={setMaxParticlesPerCell}
                            />
                        </>
                    )}
                </ColumnEntry>
                <ColumnEntry title="Particles options">
                    <SliderWithValue
                        title="Number of particles"
                        min={0}
                        max={10_000}
                        value={numberOfParticles}
                        setValue={setNumberOfParticles}
                    />
                    <SliderWithValue
                        title="Size of particles (px)"
                        min={1}
                        max={50}
                        value={sizeOfParticles}
                        setValue={setSizeOfParticles}
                    />
                    <SegmentedYesNo
                        title="Visualize particle boundaries"
                        value={visualizeParticleBoundaries}
                        onChange={(value) =>
                            setVisualizeParticleBoundaries(value)
                        }
                    />
                </ColumnEntry>
            </MasterColumn>
        </Flex>
    );
};
