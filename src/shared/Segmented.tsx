import { Flex, Button, Text, Spacer } from "@chakra-ui/react";

interface Props {
    title: string;
    options: string[];
    onChange: (val: string) => void;
    value: string;
}

export const Segmented = (props: Props) => {
    return (
        <Flex dir={"row"} w={"100%"} gap={4} alignItems={"center"}>
            <Text>{props.title}</Text>
            <Spacer />
            {props.options.map((option) => (
                <Button
                    key={option}
                    isDisabled={props.value === option}
                    onClick={() => props.onChange(option)}
                >
                    {option}
                </Button>
            ))}
        </Flex>
    );
};
