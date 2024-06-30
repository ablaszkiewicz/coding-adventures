import { Button, Flex, Heading, Spacer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface Props {
    title: string;
    children: React.ReactNode;
    previousLocation?: string;
    customButton?: {
        title: string;
        onClick: () => void;
    };
    canShrink?: boolean;
}

export const ColumnEntry = (props: Props) => {
    const navigate = useNavigate();

    return (
        <Flex
            flexDir={"column"}
            w={"100%"}
            backgroundColor={"gray.800"}
            borderRadius={10}
            alignSelf={"baseline"}
            p={4}
            shadow={"lg"}
            overflow={"hidden"}
            flexShrink={props.canShrink ? 1 : 0}
        >
            <Flex gap={4}>
                <Heading size={"lg"}>{props.title}</Heading>
                <Spacer />
                {props.previousLocation && (
                    <Button onClick={() => navigate("/")}>Back</Button>
                )}
                {props.customButton && (
                    <Button onClick={props.customButton.onClick}>
                        {props.customButton.title}
                    </Button>
                )}
            </Flex>
            <Flex flexDir={"column"} p={2} gap={4} overflow={"hidden"}>
                {props.children}
            </Flex>
        </Flex>
    );
};
