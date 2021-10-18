import React, { useState } from "react";

import {
    Button,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    Text,
} from "@chakra-ui/react";

import { Note } from "@app/types";
import { AddIcon } from "@chakra-ui/icons";

type Props = {
    notes: Note[];
    updateSelectedNote: (note?: Note) => void;
    addNote: (noteName: string, categoryID: string) => Promise<boolean>;
    categoryID: string;
    isLoading: boolean;
};

export function NoteTitles({
    notes,
    updateSelectedNote,
    addNote,
    categoryID,
    isLoading,
}: Props) {
    const [newNoteTopic, updateNewNoteTopic] = useState("");

    return (
        <VStack spacing={{ base: 2 }}>
            {notes.map((note) => (
                <Button
                    variant="link"
                    onClick={() => updateSelectedNote(note)}
                    key={note.key}
                    textTransform="capitalize"
                >
                    <Text isTruncated>{note.topic}</Text>
                </Button>
            ))}
            <InputGroup>
                <Input
                    value={newNoteTopic}
                    onChange={(e) => updateNewNoteTopic(e.target.value)}
                    maxLength={40}
                    placeholder="New Note"
                    variant="filled"
                />
                <InputRightElement>
                    <IconButton
                        icon={<AddIcon />}
                        onClick={async () => {
                            const success = await addNote(
                                newNoteTopic,
                                categoryID
                            );
                            if (success) updateNewNoteTopic("");
                        }}
                        aria-label="Add new note"
                        variant="ghost"
                        size="sm"
                        color="gray.500"
                        isDisabled={isLoading}
                        isRound
                    />
                </InputRightElement>
            </InputGroup>
        </VStack>
    );
}
