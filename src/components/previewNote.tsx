import React from "react";

import {
    Flex,
    Heading,
    useBoolean,
    VStack,
    Button,
    ButtonGroup,
    Spinner,
    Textarea,
    Box,
} from "@chakra-ui/react";

import ReactMarkdown from "react-markdown";
import { sanitize } from "dompurify";

import { Note } from "@app/types";

import { componentMap } from "@app/componentMap";

type Props = {
    note?: Note;
    updateNote: (note: Note) => void;
    onDelete: (note: Note) => void;
    onSave: (note: Note) => void;
    width: string;
    isLoading: boolean;
};

export function PreviewNote({
    note,
    updateNote,
    width,
    onDelete,
    onSave,
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
            <Heading textAlign="center" textTransform="capitalize" isTruncated>
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
                {!previewMode && (
                    <Button
                        colorScheme="purple"
                        onClick={() => onSave(note)}
                        isDisabled={isLoading}
                    >
                        Save
                    </Button>
                )}
            </ButtonGroup>
            {previewMode && isLoading ? (
                <Spinner size="lg" />
            ) : previewMode ? (
                <Box
                    textAlign="left"
                    width="100%"
                    as={ReactMarkdown}
                    components={componentMap}
                >
                    {note.content}
                </Box>
            ) : (
                <Textarea
                    value={note.content}
                    onChange={(e) => {
                        updateNote({
                            ...note,
                            content: sanitize(e.target.value),
                        });
                    }}
                    resize="vertical"
                    isDisabled={isLoading}
                    height="60vh"
                />
            )}
        </VStack>
    );
}
