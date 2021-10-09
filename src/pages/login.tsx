import React from "react";

import {
    Center,
    Heading,
    Tab,
    Text,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    InputGroup,
    Input,
    VStack,
    InputLeftElement,
    Button,
} from "@chakra-ui/react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail, MdLogin } from "react-icons/md";
import { FiUserPlus } from "react-icons/fi";

import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

import { PasswordInput } from "@components/passwordInput";

export default function Login() {
    return (
        <Center width="100%" height="100vh">
            <Tabs boxShadow="md" variant="enclosed" isLazy>
                <TabList>
                    <Tab fontSize={{ base: "lg", md: "xl" }}>Sign Up</Tab>
                    <Tab fontSize={{ base: "lg", md: "xl" }}>Log In</Tab>
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
        </Center>
    );
}

function SignUpPanel() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Sign Up");
    };

    return (
        <VStack justifyContent="center" width="100%">
            <Heading size="lg" textAlign="center">
                Sign Up
            </Heading>
            <Text fontSize="xs" textAlign="center" color="gray.500">
                Create a free account.
            </Text>
            <VStack
                as="form"
                mt={4}
                width="100%"
                spacing={{ base: 4 }}
                onSubmit={handleSubmit}
            >
                <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.500">
                        <FaRegUser />
                    </InputLeftElement>
                    <Input variant="filled" placeholder="Full Name" />
                </InputGroup>
                <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.500">
                        <MdOutlineEmail />
                    </InputLeftElement>
                    <Input
                        variant="filled"
                        autoComplete="username"
                        placeholder="Email Address"
                    />
                </InputGroup>
                <PasswordInput placeholder="Password" />
                <PasswordInput placeholder="Confirm Password" />
                <Button type="submit" leftIcon={<FiUserPlus />}>
                    Sign Up
                </Button>
            </VStack>
        </VStack>
    );
}

function LoginPanel() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Sign Up");
    };

    return (
        <VStack justifyContent="center" width="100%">
            <Heading size="lg" textAlign="center">
                Log In
            </Heading>
            <Text fontSize="xs" textAlign="center" color="gray.500">
                Access your existing account.
            </Text>
            <VStack
                as="form"
                mt={4}
                width="100%"
                spacing={{ base: 4 }}
                onSubmit={handleSubmit}
            >
                <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.500">
                        <MdOutlineEmail />
                    </InputLeftElement>
                    <Input
                        variant="filled"
                        autoComplete="username"
                        placeholder="Email Address"
                    />
                </InputGroup>
                <PasswordInput placeholder="Password" />
                <Button type="submit" rightIcon={<MdLogin />}>
                    Log In
                </Button>
            </VStack>
        </VStack>
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
