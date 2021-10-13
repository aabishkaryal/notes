import React, { useState } from "react";

import { GetServerSideProps } from "next";
import Head from "next/head";
import { getSession } from "next-auth/client";

import { Flex, useBreakpointValue } from "@chakra-ui/react";

import { Deta } from "deta";

import { fetchAll, fetchCategories, fetchNotes } from "@app/db";
import { Category, Note, User } from "@app/types";

import { Header } from "@components/header";
import { NoteList } from "@components/noteList";

type Props = {
    notes: { [name: string]: Note[] };
    categories: Category[];
};

export default function Dashboard({ notes, categories }: Props) {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [activeNote, updateActiveNote] = useState<Note | undefined>();
    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <Header />
            {isMobile ? (
                <Flex width="100%" justifyContent="center">
                    <NoteList
                        notes={notes}
                        categories={categories}
                        updateSelected={(note) => {
                            updateActiveNote(note);
                        }}
                    />
                </Flex>
            ) : (
                <>Not Mobile</>
            )}
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
