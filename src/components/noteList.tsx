import React, { useState } from "react";

import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Button,
    Flex,
    Text,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
    Heading,
} from "@chakra-ui/react";

import { Category, Note } from "@app/types";
import { AddIcon } from "@chakra-ui/icons";

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
    const { isOpen, onOpen, onClose } = useDisclosure();
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
        setTimeout(onClose);
    };
    return (
        <Flex
            width={{ base: "100%", sm: "75%" }}
            flexWrap="wrap"
            flexDirection="column"
            alignItems="center"
            padding={{ base: 3 }}
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
                            <AccordionPanel></AccordionPanel>
                        </AccordionItem>
                    );
                })}
            </Accordion>
            <Button
                variant="solid"
                leftIcon={<AddIcon />}
                onClick={onOpen}
                size="md"
                width="180px"
                marginY={{ base: 3 }}
            >
                Add Category
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>New Category</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex
                            as="form"
                            onSubmit={addCategory}
                            flexDir="column"
                            alignItems="center"
                        >
                            <FormControl id="category-name" isRequired>
                                <FormLabel>Category Name</FormLabel>
                                <Input
                                    value={newCategoryName}
                                    onChange={(e) =>
                                        updateNewCategoryName(e.target.value)
                                    }
                                    maxLength={40}
                                />
                                {newCategoryName.length >= 40 && (
                                    <FormHelperText fontSize="xs">
                                        Category name is too long
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <Button
                                variant="solid"
                                type="submit"
                                width="50px"
                                marginY={{ base: 3 }}
                                isLoading={loading}
                            >
                                Add
                            </Button>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
}
