import { InfoIcon } from "@chakra-ui/icons";
import { Flex, Button, Text, Spacer, Tooltip } from "@chakra-ui/react";

interface Props {
    title: string;
    options: string[];
    onChange: (val: string) => void;
    value: string;
    tooltip?: string;
}

export const Segmented = (props: Props) => {
    return (
        <Flex dir={"row"} w={"100%"} gap={4} alignItems={"center"}>
            <Text>{props.title}</Text>
            {props.tooltip && (
                <Tooltip label={props.tooltip}>
                    <InfoIcon />
                </Tooltip>
            )}
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
