import React, { useState } from "react";

import {
    Accordion,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";

import { Category, Note } from "@app/types";
import { AddIcon } from "@chakra-ui/icons";

type Props = {
    notes: { [name: string]: Note[] };
    categories: Category[];
};

export function NoteList({ notes: n, categories: c }: Props) {
    const [notes, updateNotes] = useState(n);
    const [categories, updateCategories] = useState(c);
    const [newCategoryName, updateNewCategoryName] = useState("");

    const [loading, updateLoading] = useState("loading");
    const { isOpen, onOpen, onClose } = useDisclosure();

    const addCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        console.debug({ newCategoryName });
        const res = await fetch("/api/category/add", {
            method: "POST",
            body: JSON.stringify({ name: newCategoryName }),
        });
    };
    return (
        <Flex
            width={{ base: "100%", sm: "75%" }}
            flexWrap="wrap"
            flexDirection="column"
            alignItems="center"
            padding={{ base: 3 }}
        >
            <Accordion width="100%" allowMultiple>
                {categories.map((c) => {
                    return <>{c.name}</>;
                })}
            </Accordion>
            <Button
                variant="solid"
                leftIcon={<AddIcon />}
                onClick={onOpen}
                size="md"
                width="180px"
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
                                />
                            </FormControl>
                            <Button
                                variant="solid"
                                type="submit"
                                width="50px"
                                marginY={{ base: 3 }}
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
