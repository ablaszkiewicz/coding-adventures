import {
    Flex,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Input,
    Text,
} from "@chakra-ui/react";

interface Props {
    title: string;
    value: number;
    setValue: (val: number) => void;
    min: number;
    max: number;
}

export const SliderWithValue = (props: Props) => {
    return (
        <Flex flexDir={"column"}>
            <Text>{props.title}</Text>
            <Flex flexDir={"row"} gap={4}>
                <Slider
                    aria-label="number of particles"
                    min={props.min}
                    max={props.max}
                    value={props.value}
                    onChange={(val) => props.setValue(val)}
                    width={"70%"}
                    focusThumbOnChange={false}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
                <Input
                    type="number"
                    value={props.value}
                    onChange={(e) => props.setValue(Number(e.target.value))}
                    width={"30%"}
                />
            </Flex>
        </Flex>
    );
};
