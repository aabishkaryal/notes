import React, { useState } from "react";

import {
    Button,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    useToast,
    VStack,
} from "@chakra-ui/react";

import { Note } from "@app/types";
import { AddIcon } from "@chakra-ui/icons";

type Props = {
    notes: Note[];
    updateSelectedNote: (note?: Note) => void;
    categoryID: string;
};

export function NoteTitles({
    notes: n,
    updateSelectedNote,
    categoryID,
}: Props) {
    const [notes, updateNotes] = useState(n);
    const [newNoteTopic, updateNewNoteTopic] = useState("");
    const [loading, updateLoading] = useState(false);

    const toast = useToast();

    const addNote = async () => {
        updateLoading(true);
        const res = await fetch("/api/note/add", {
            method: "POST",
            body: JSON.stringify({ topic: newNoteTopic, categoryID }),
        });
        const json = await res.json();
        if (res.status == 200) {
            updateNotes([...notes, json.note]);
            updateNewNoteTopic("");
            toast({
                title: json.message,
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        } else {
            toast({
                title: json.error,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        }
        updateLoading(false);
    };

    return (
        <VStack spacing={{ base: 2 }}>
            {notes.map((note) => (
                <Button
                    variant="link"
                    onClick={() => updateSelectedNote(note)}
                    key={note.key}
                    textTransform="capitalize"
                >
                    {note.topic}
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
                        onClick={addNote}
                        aria-label="Add new note"
                        variant="ghost"
                        size="sm"
                        color="gray.500"
                        isLoading={loading}
                        isRound
                    />
                </InputRightElement>
            </InputGroup>
        </VStack>
    );
}
