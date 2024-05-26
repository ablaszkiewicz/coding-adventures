import { Flex, Heading } from "@chakra-ui/react";

interface Props {
    title: string;
    children: React.ReactNode;
}

export const ColumnEntry = (props: Props) => {
    return (
        <Flex
            flexDir={"column"}
            w={"100%"}
            backgroundColor={"gray.800"}
            borderRadius={10}
            alignSelf={"baseline"}
            p={4}
        >
            <Heading size={"lg"}>{props.title}</Heading>
            <Flex flexDir={"column"} p={2} gap={4}>
                {props.children}
            </Flex>
        </Flex>
    );
};
