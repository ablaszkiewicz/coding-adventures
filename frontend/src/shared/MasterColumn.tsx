import { Flex } from "@chakra-ui/react";

interface Props {
    children: React.ReactNode;
}

export const MasterColumn = (props: Props) => {
    return (
        <Flex
            flexDir={"column"}
            w={"100%"}
            borderRadius={10}
            alignSelf={"baseline"}
            gap={8}
            overflow={"hidden"}
            h={"100%"}
        >
            {props.children}
        </Flex>
    );
};
