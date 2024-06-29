import { Flex, IconButton, Spacer } from "@chakra-ui/react";
import { ObjectOnScene, useRayTracingStore } from "./store";
import { DeleteIcon } from "@chakra-ui/icons";

interface Props {
    object: ObjectOnScene;
}

export const ObjectOnSceneListItem = (props: Props) => {
    const { removeObject } = useRayTracingStore();

    return (
        <Flex
            w={"100%"}
            alignItems={"center"}
            backgroundColor={"gray.800"}
            p={3}
            borderRadius={10}
        >
            {props.object.name}
            <Spacer />
            <IconButton
                icon={<DeleteIcon />}
                aria-label="Delete"
                onClick={() => removeObject(props.object.name)}
            />
        </Flex>
    );
};
