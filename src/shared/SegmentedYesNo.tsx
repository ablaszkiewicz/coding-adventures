import { Flex, Button, Text, Spacer } from "@chakra-ui/react";

interface Props {
    title: string;
    onChange: (val: boolean) => void;
    value: boolean;
}

export const SegmentedYesNo = (props: Props) => {
    return (
        <Flex dir={"row"} w={"100%"} gap={4} alignItems={"center"}>
            <Text>{props.title}</Text>
            <Spacer />
            <Button
                isDisabled={props.value === true}
                onClick={() => props.onChange(true)}
            >
                Yes
            </Button>
            <Button
                isDisabled={props.value === false}
                onClick={() => props.onChange(false)}
            >
                No
            </Button>
        </Flex>
    );
};
