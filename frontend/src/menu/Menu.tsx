import { Flex, Heading } from "@chakra-ui/react";
import { MenuItem } from "./MenuItem";

export const Menu = () => {
    return (
        <Flex
            w={"100vw"}
            h={"100vh"}
            backgroundColor={"gray.900"}
            justifyContent={"center"}
            alignItems={"center"}
            direction={"column"}
            gap={8}
        >
            <Heading>Coding adventures</Heading>
            <MenuItem
                title="Quad tree"
                url="quad-tree"
                description="A simulation which shows the difference between classic and quad tree approaches when searching things on a 2D plane"
            />
            <MenuItem
                title="Ray tracing"
                url="ray-tracing"
                description="Ray tracer built from the scratch in TypeScript. Supports spheres. Uses lambertian and metal materials. Runs on a web worker"
            />
            <MenuItem
                isDisabled
                title="Distributed ray tracing"
                url="distributed-ray-tracing"
                description="Ray tracer on lambdas. Work in progress."
            />
        </Flex>
    );
};
