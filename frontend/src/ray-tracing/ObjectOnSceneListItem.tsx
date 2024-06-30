import { Flex, IconButton, Select, Spacer, Text } from "@chakra-ui/react";
import { ObjectOnScene, useRayTracingStore } from "./store";
import { DeleteIcon } from "@chakra-ui/icons";
import { MaterialType } from "./engine/materials/material";
import { vectorToColor, colorsToVector } from "./colors";

interface Props {
    object: ObjectOnScene;
}

export const ObjectOnSceneListItem = (props: Props) => {
    const { removeObject, updateMaterial, updateColor } = useRayTracingStore();

    return (
        <Flex
            w={"100%"}
            alignItems={"center"}
            backgroundColor={"gray.800"}
            p={2}
            borderRadius={10}
            gap={2}
        >
            <Text>{props.object.name}</Text>
            <Spacer />
            <Select
                w={"auto"}
                variant={"filled"}
                value={vectorToColor(props.object.color)}
                onChange={(e) =>
                    updateColor(
                        props.object.name,
                        colorsToVector[
                            e.target.value as keyof typeof colorsToVector
                        ]
                    )
                }
            >
                {Object.keys(colorsToVector).map((color) => (
                    <option key={color}>{color}</option>
                ))}
            </Select>
            <Select
                w={"auto"}
                variant={"filled"}
                value={props.object.material}
                onChange={(e) =>
                    updateMaterial(
                        props.object.name,
                        e.target.value as MaterialType
                    )
                }
            >
                {Object.values(MaterialType).map((materialType) => (
                    <option key={materialType}>{materialType}</option>
                ))}
            </Select>
            <IconButton
                size={"md"}
                icon={<DeleteIcon />}
                aria-label="Delete"
                onClick={() => removeObject(props.object.name)}
            />
        </Flex>
    );
};
