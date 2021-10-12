import { GetServerSideProps } from "next";
import Head from "next/head";
import { getSession } from "next-auth/client";

import { Header } from "@components/header";

type Props = {};

export default function Dashboard({}: Props) {
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
    return {
        props: {},
    };
};
