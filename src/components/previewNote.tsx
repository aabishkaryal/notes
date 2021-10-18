import React from "react";

import {
    Flex,
    Heading,
    HStack,
    useBoolean,
    VStack,
    Button,
    ButtonGroup,
    Spinner,
    Text,
} from "@chakra-ui/react";

import { Note } from "@app/types";

type Props = {
    note?: Note;
    updateNote: (note: Note) => void;
    onDelete: (note: Note) => void;
    width: string;
    isLoading: boolean;
};

export function PreviewNote({
    note,
    updateNote,
    width,
    onDelete,
    isLoading,
}: Props) {
    const [previewMode, updatePreviewMode] = useBoolean(true);

    // No note selected.
    if (!note)
        return (
            <Flex width={width} justifyContent="center" flexDir="column">
                <Heading textAlign="center">Select a note.</Heading>
            </Flex>
        );

    return (
        <VStack width={width} spacing={{ base: 6 }} padding="4">
            <HStack justifyContent="space-between" width="100%">
                <Heading textAlign="center" textTransform="capitalize">
                    {note.topic}
                </Heading>
                <ButtonGroup isAttached>
                    <Button
                        colorScheme="purple"
                        onClick={updatePreviewMode.toggle}
                        isDisabled={isLoading}
                    >
                        {previewMode ? "Edit" : "Preview"}
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={() => onDelete(note)}
                        isDisabled={isLoading}
                    >
                        Delete
                    </Button>
                </ButtonGroup>
            </HStack>
            {isLoading ? (
                <Spinner size="lg" />
            ) : (
                <Text fontSize="lg" textAlign="left" width="100%">
                    {note.content}
                </Text>
            )}
        </VStack>
    );
}
