import React, { useState } from "react";

import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Flex,
    Text,
    Input,
    useToast,
    Heading,
    InputGroup,
    InputRightElement,
    IconButton,
    VStack,
} from "@chakra-ui/react";

import { Category, Note } from "@app/types";
import { AddIcon } from "@chakra-ui/icons";
import { Notes } from "@components/notes";

type Props = {
    notes: { [name: string]: Note[] };
    categories: Category[];
    updateSelected: (note: Note) => void;
};

export function NoteList({ notes: n, categories: c, updateSelected }: Props) {
    const [notes, updateNotes] = useState(n);
    const [categories, updateCategories] = useState(c);
    const [newCategoryName, updateNewCategoryName] = useState("");

    const [loading, updateLoading] = useState(false);
    const toast = useToast();

    const addCategory = async (e: React.FormEvent) => {
        updateLoading(true);
        e.preventDefault();
        const res = await fetch("/api/category/add", {
            method: "POST",
            body: JSON.stringify({ name: newCategoryName }),
        });
        const json = await res.json();
        if (res.status == 200) {
            updateCategories([...categories, json.category]);
            updateNotes({ ...notes, [json.category.key]: [] });
            updateNewCategoryName("");
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
        <VStack
            width={{ base: "100%", sm: "75%" }}
            alignItems="center"
            padding={{ base: 3 }}
            spacing={{ base: 2 }}
        >
            <Heading>Your Notes</Heading>
            <Accordion width="100%" allowMultiple allowToggle>
                {categories.map((c) => {
                    return (
                        <AccordionItem key={c.key} margin={{ base: 1 }}>
                            <AccordionButton>
                                <Flex
                                    width="100%"
                                    justifyContent="space-between"
                                >
                                    <Text isTruncated>{c.name}</Text>
                                    <AccordionIcon />
                                </Flex>
                            </AccordionButton>
                            <AccordionPanel>
                                <Notes
                                    notes={notes[c.key] || []}
                                    updateSelectedNote={updateSelected}
                                    categoryID={c.key}
                                />
                            </AccordionPanel>
                        </AccordionItem>
                    );
                })}
            </Accordion>
            <InputGroup>
                <Input
                    value={newCategoryName}
                    onChange={(e) => updateNewCategoryName(e.target.value)}
                    maxLength={40}
                    placeholder="New Category"
                    variant="filled"
                />
                <InputRightElement>
                    <IconButton
                        icon={<AddIcon />}
                        onClick={addCategory}
                        aria-label="Add new category of notes"
                        variant="ghost"
                        isRound
                        size="sm"
                        color="gray.500"
                        isLoading={loading}
                    />
                </InputRightElement>
            </InputGroup>
        </VStack>
    );
}
