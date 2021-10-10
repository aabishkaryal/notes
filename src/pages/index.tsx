import { Box } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
// import { getSession } from "next-auth/client";

export default function Home() {
    return (
        <>
            <Head>
                <title>Notes</title>
            </Head>
            <Box>Notes!</Box>
        </>
    );
}

export const getServerSideProps: GetServerSideProps<{}> = async (ctx) => {
    // const session = await getSession(ctx);
    // if (!(session && session.user))
    //     return {
    //         redirect: {
    //             destination: "/dashboard",
    //             permanent: false,
    //         },
    //     };
    // return {
    //     props: {},
    // };
    return {
        redirect: {
            destination: "/dashboard",
            permanent: false,
        },
    };
};
