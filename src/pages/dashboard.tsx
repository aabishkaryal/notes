import React, { useState } from "react";

import { GetServerSideProps } from "next";
import Head from "next/head";
import { getSession } from "next-auth/client";

import { Deta } from "deta";

import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Flex,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    useBreakpointValue,
    VStack,
    Text,
    useToast,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    useBoolean,
    Button,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

import { fetchAll, fetchCategories, fetchNotes } from "@app/db";
import { Category, Note, User } from "@app/types";

import { Header } from "@components/header";
import { NoteTitles } from "@components/noteTitles";
import { PreviewNote } from "@components/previewNote";

type Props = {
    notes: { [key: string]: Note[] };
    categories: Category[];
};

export default function Dashboard({ notes: n, categories: c }: Props) {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [activeNote, updateActiveNote] = useState<Note | undefined>();

    const [notes, updateNotes] = useState(n);
    const [categories, updateCategories] = useState(c);
    const [newCategoryName, updateNewCategoryName] = useState("");

    const [categoryLoading, updateCategoryLoading] = useBoolean(false);
    const [previewLoading, updatePreviewLoading] = useBoolean(false);
    const [noteTitlesLoading, updateNoteTitlesLoading] = useBoolean(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const handleError = (error: unknown) => {
        console.debug({ error });
        toast({
            title: "Check your internet connection and try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
        });
    };

    const addCategory = async (e: React.FormEvent) => {
        updateCategoryLoading.on();
        e.preventDefault();
        const res = await fetch("/api/category/add", {
            method: "POST",
            body: JSON.stringify({ name: newCategoryName }),
        });
        try {
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
        } catch (error) {
            handleError(error);
        } finally {
            updateCategoryLoading.off();
        }
    };

    const deleteCategory = async (category: Category) => {
        updateCategoryLoading.on();
        const res = await fetch("/api/category/delete", {
            method: "POST",
            body: JSON.stringify({ category }),
        });
        try {
            const json = await res.json();
            if (res.status == 200) {
                updateCategories(
                    categories.filter((c) => c.key != category.key)
                );
                const newNotes = Object.assign({}, notes);
                delete newNotes[category.key];
                updateNotes(newNotes);
                if (activeNote && activeNote.categoryID == category.key)
                    updateActiveNote(undefined);

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
        } catch (error) {
            handleError(error);
        } finally {
            updateCategoryLoading.off();
        }
    };

    const addNote = async (topic: string, categoryID: string) => {
        updateNoteTitlesLoading.on();
        const res = await fetch("/api/note/add", {
            method: "POST",
            body: JSON.stringify({ topic, categoryID }),
        });
        let success = false;
        try {
            const json = await res.json();
            if (res.status == 200) {
                updateNotes({
                    ...notes,
                    [categoryID]: [...notes[categoryID], json.note],
                });
                toast({
                    title: json.message,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
                success = true;
            } else {
                toast({
                    title: json.error,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
            }
        } catch (error) {
            handleError(error);
        } finally {
            updateNoteTitlesLoading.off();
        }
        return success;
    };

    const deleteNote = async (note: Note) => {
        updatePreviewLoading.on();
        const res = await fetch("/api/note/delete", {
            method: "DELETE",
            body: JSON.stringify({ note }),
        });
        try {
            const json = await res.json();
            if (res.status == 200) {
                toast({
                    title: json.message,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
                updateNotes({
                    ...notes,
                    [note.categoryID]: notes[note.categoryID].filter(
                        (n) => n.key != note.key
                    ),
                });
                updateActiveNote(undefined);
                onClose();
            } else {
                toast({
                    title: json.error,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
            }
        } catch (error) {
            handleError(error);
        } finally {
            updatePreviewLoading.off();
        }
    };

    const locallyUpdateNote = async (note: Note) => {
        updateActiveNote(note);
        updateNotes({
            ...notes,
            [note.categoryID]: [
                ...notes[note.categoryID].filter((n) => n.key != note.key),
                note,
            ],
        });
    };

    const saveNote = async (note: Note) => {
        updatePreviewLoading.on();
        const res = await fetch("/api/note/save", {
            method: "PUT",
            body: JSON.stringify({ note }),
        });
        try {
            const json = await res.json();
            if (res.status == 200) {
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
        } catch (error) {
            handleError(error);
        } finally {
            updatePreviewLoading.off();
        }
    };

    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <Header />
            <Flex
                flexDir={isMobile ? "column" : "row"}
                justifyContent={{ base: "center", md: "space-around" }}
                width="100%"
                alignItems="stretch"
            >
                <VStack
                    width={{ base: "100%", sm: "75%", md: "45%" }}
                    alignItems="center"
                    padding={{ base: 3 }}
                    spacing={{ base: 2 }}
                >
                    <Heading>Your Notes</Heading>
                    <Accordion width="100%" allowMultiple allowToggle>
                        {categories.map((c) => {
                            return (
                                <AccordionItem key={c.key} margin={{ base: 1 }}>
                                    <Heading>
                                        <AccordionButton>
                                            <Flex
                                                width="100%"
                                                justifyContent="space-between"
                                            >
                                                <Text
                                                    isTruncated
                                                    textTransform="capitalize"
                                                    fontSize="xl"
                                                    fontWeight="bold"
                                                >
                                                    {c.name}
                                                </Text>
                                                <AccordionIcon />
                                            </Flex>
                                        </AccordionButton>
                                    </Heading>
                                    <AccordionPanel>
                                        <VStack alignItems="stretch">
                                            <Button
                                                colorScheme="red"
                                                rightIcon={<DeleteIcon />}
                                                alignSelf="flex-end"
                                                onClick={() =>
                                                    deleteCategory(c)
                                                }
                                                isDisabled={categoryLoading}
                                            >
                                                Delete
                                            </Button>
                                            <NoteTitles
                                                notes={notes[c.key] || []}
                                                updateSelectedNote={(note) => {
                                                    updateActiveNote(note);
                                                    isMobile && onOpen();
                                                }}
                                                categoryID={c.key}
                                                addNote={addNote}
                                                isLoading={noteTitlesLoading}
                                            />
                                        </VStack>
                                    </AccordionPanel>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                    <InputGroup>
                        <Input
                            value={newCategoryName}
                            onChange={(e) =>
                                updateNewCategoryName(e.target.value)
                            }
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
                                size="sm"
                                color="gray.500"
                                isLoading={categoryLoading}
                                isRound
                            />
                        </InputRightElement>
                    </InputGroup>
                </VStack>
                {isMobile ? (
                    <Modal
                        isOpen={isOpen}
                        onClose={() => {
                            updateActiveNote(undefined);
                            onClose();
                        }}
                        size="lg"
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalCloseButton />
                            <ModalBody paddingY="8" paddingX="6">
                                <PreviewNote
                                    note={activeNote}
                                    updateNote={locallyUpdateNote}
                                    onSave={saveNote}
                                    width="90%"
                                    onDelete={deleteNote}
                                    isLoading={previewLoading}
                                />
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                ) : (
                    <PreviewNote
                        note={activeNote}
                        updateNote={locallyUpdateNote}
                        width="45%"
                        onDelete={deleteNote}
                        onSave={saveNote}
                        isLoading={previewLoading}
                    />
                )}
            </Flex>
        </>
    );
}

export const getServerSideProps: GetServerSideProps<{}> = async (ctx) => {
    const session = await getSession(ctx);
    if (!(session && session.user))
        return {
            redirect: {
                destination: "/auth",
                permanent: false,
            },
        };

    const deta = Deta(process.env.DETA_PROJECT_KEY);
    const userDB = deta.Base("User");
    const categoryDB = deta.Base("Category");
    const notesDB = deta.Base("Notes");

    const email = session.user.email || "";
    const [user, ..._] = await fetchAll<User>(userDB, { email });
    const categories = await fetchCategories(categoryDB, user.categoryIDs);
    const notes = await fetchNotes(notesDB, categories);
    return {
        props: { notes, categories },
    };
};
