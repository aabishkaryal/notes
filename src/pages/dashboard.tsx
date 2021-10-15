import React, { useState } from "react";

import { GetServerSideProps } from "next";
import Head from "next/head";
import { getSession } from "next-auth/client";

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
} from "@chakra-ui/react";

import { Deta } from "deta";

import { fetchAll, fetchCategories, fetchNotes } from "@app/db";
import { Category, Note, User } from "@app/types";

import { Header } from "@components/header";
import { AddIcon } from "@chakra-ui/icons";
import { Notes } from "@components/notes";

type Props = {
    notes: { [name: string]: Note[] };
    categories: Category[];
};

export default function Dashboard({ notes: n, categories: c }: Props) {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [activeNote, updateActiveNote] = useState<Note | undefined>();

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
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <Header />
            <Flex
                flexDir={isMobile ? "column" : "row"}
                justifyContent="center"
                width="100%"
                alignItems="center"
            >
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
                                            updateSelectedNote={console.debug}
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
                                isRound
                                size="sm"
                                color="gray.500"
                                isLoading={loading}
                            />
                        </InputRightElement>
                    </InputGroup>
                </VStack>
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
