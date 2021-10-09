import React, { useState } from "react";

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
    FormControl,
} from "@chakra-ui/react";
import { MdOutlineEmail, MdLogin } from "react-icons/md";
import { FiUserPlus } from "react-icons/fi";

import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

import { PasswordInput } from "@components/passwordInput";
import { validateEmail } from "@app/utils";

export default function Login() {
    return (
        <Center width="100%" height="100vh">
            <Tabs boxShadow="md" variant="enclosed" isLazy isFitted>
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

type AuthError = {
    email?: string;
    password?: string;
};

function SignUpPanel() {
    const [email, updateEmail] = useState("");
    const [password, updatePassword] = useState("");
    const [confirmPassword, updateConfirmPassword] = useState("");
    const [error, updateError] = useState<AuthError>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Sign Up", { email, password, confirmPassword });
        if (!email) {
            updateError({ email: "Please enter an email." });
        } else if (!password) {
            updateError({ password: "Please enter a password." });
        } else if (!validateEmail(email)) {
            updateError({ email: "Please enter a valid email." });
        } else if (password !== confirmPassword) {
            updateError({ password: "Passwords do not match." });
        } else {
            updateError({});
        }
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
                <FormControl>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none" color="gray.500">
                            <MdOutlineEmail />
                        </InputLeftElement>
                        <Input
                            variant="filled"
                            autoComplete="username"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => updateEmail(e.target.value)}
                            isInvalid={!!error.email}
                        />
                    </InputGroup>
                    {error.email && (
                        <Text color="red" fontSize="xs">
                            {error.email}
                        </Text>
                    )}
                </FormControl>
                <PasswordInput
                    placeholder="Password"
                    value={password}
                    onChange={(value) => updatePassword(value)}
                    error={error.password}
                />
                <PasswordInput
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(value) => updateConfirmPassword(value)}
                    error={error.password}
                />
                <Button type="submit" leftIcon={<FiUserPlus />}>
                    Sign Up
                </Button>
            </VStack>
        </VStack>
    );
}

function LoginPanel() {
    const [email, updateEmail] = useState("");
    const [password, updatePassword] = useState("");
    const [error, updateError] = useState<AuthError>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Log In", { email, password });
        if (!email) {
            updateError({ email: "Please enter an email." });
        } else if (!password) {
            updateError({ password: "Please enter a password." });
        } else if (!validateEmail(email)) {
            updateError({ email: "Please enter a valid email." });
        } else {
            updateError({});
        }
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
                <FormControl>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none" color="gray.500">
                            <MdOutlineEmail />
                        </InputLeftElement>
                        <Input
                            variant="filled"
                            autoComplete="username"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => updateEmail(e.target.value)}
                            isInvalid={!!error.email}
                        />
                    </InputGroup>
                    {error.email && (
                        <Text color="red" fontSize="xs">
                            {error.email}
                        </Text>
                    )}
                </FormControl>
                <PasswordInput
                    placeholder="Password"
                    value={password}
                    onChange={(value) => updatePassword(value)}
                    error={error.password}
                />
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
