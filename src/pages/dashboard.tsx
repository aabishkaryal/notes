import { GetServerSideProps } from "next";
import Head from "next/head";
import { getSession } from "next-auth/client";

import { Header } from "@components/header";
import { fetchAll, fetchNotes } from "@app/db";
import { User } from "@app/types";
import { Deta } from "deta";

type Props = {
    notes: { [name: string]: string[] };
};

export default function Dashboard({ notes }: Props) {
    console.debug({ notes });
    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <Header />
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
    const notesDrive = deta.Drive("Notes");

    const email = session.user.email || "";
    const [user, ..._] = await fetchAll<User>(userDB, { email });
    const notes = await fetchNotes(categoryDB, notesDrive, user.categories);
    return {
        props: { notes },
    };
};
