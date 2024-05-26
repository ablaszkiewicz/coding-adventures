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
                description="A simulation showing difference between classic vs quad tree approach when searching ranges on a 2D plane"
            />
        </Flex>
    );
};
