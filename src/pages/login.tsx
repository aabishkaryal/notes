import React from "react";

import {
    Box,
    Flex,
    Heading,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

export default function Login({}) {
    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100vh"
        >
            <Tabs boxShadow="md" padding={{ base: 2 }} isLazy>
                <TabList>
                    <Tab>Sign Up</Tab>
                    <Tab>Log In</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <SignUpPanel />
                    </TabPanel>
                    <TabPanel>
                        <LoginPanel />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Flex>
    );
}

function LoginPanel() {
    return (
        <Flex justifyContent="center">
            <Heading size="lg">Log In</Heading>
        </Flex>
    );
}

function SignUpPanel() {
    return (
        <Flex justifyContent="center">
            <Heading size="lg">Sign Up</Heading>
        </Flex>
    );
}

export const getServerSideProps: GetServerSideProps<{}> = async (ctx) => {
    const session = await getSession(ctx);
    if (session && session.user)
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    return {
        props: {},
    };
};
