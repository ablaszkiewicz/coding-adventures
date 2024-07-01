import { ChevronRightIcon } from "@chakra-ui/icons";
import { Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface Props {
    title: string;
    url: string;
    description: string;
    isDisabled?: boolean;
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
            borderRadius={10}
            shadow={"lg"}
        >
            <Flex flexDir={"column"} gap={4}>
                <Heading size={"md"}>{props.title}</Heading>
                <Text opacity={0.6}>{props.description}</Text>
            </Flex>
            <Spacer />

            <Button
                h={"100%"}
                alignSelf={"stretch"}
                onClick={() => navigate(props.url)}
                isDisabled={props.isDisabled}
            >
                <ChevronRightIcon fontSize={"2xl"} />
            </Button>
        </Flex>
    );
};
