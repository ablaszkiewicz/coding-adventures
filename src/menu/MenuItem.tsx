import { ChevronRightIcon } from "@chakra-ui/icons";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface Props {
    title: string;
    url: string;
    description: string;
}

export const MenuItem = (props: Props) => {
    const navigate = useNavigate();

    return (
        <Flex
            backgroundColor={"gray.800"}
            p={8}
            flexDir={"row"}
            w={"30%"}
            alignItems={"center"}
            gap={8}
            borderRadius={10}
            shadow={"lg"}
        >
            <Flex flexDir={"column"} gap={4}>
                <Heading size={"md"}>{props.title}</Heading>
                <Text opacity={0.6}>{props.description}</Text>
            </Flex>
            <Button
                h={"100%"}
                alignSelf={"stretch"}
                onClick={() => navigate(props.url)}
            >
                <ChevronRightIcon fontSize={"2xl"} />
            </Button>
        </Flex>
    );
};
