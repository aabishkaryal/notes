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
    useToast,
} from "@chakra-ui/react";
import { MdOutlineEmail, MdLogin } from "react-icons/md";
import { FiUserPlus } from "react-icons/fi";

import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getSession, signIn } from "next-auth/client";

import { PasswordInput } from "@components/passwordInput";
import { validateEmail, validatePassword } from "@app/utils";

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
    const [loading, updateLoading] = useState(false);

    const toast = useToast();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            updateError({ email: "Please enter an email." });
        } else if (!password) {
            updateError({ password: "Please enter a password." });
        } else if (!validateEmail(email)) {
            updateError({ email: "Please enter a valid email." });
        } else if (!validatePassword(password)) {
            updateError({
                password:
                    "Passwords must be at least 8 character long with 2 numbers.",
            });
        } else if (password !== confirmPassword) {
            updateError({ password: "Passwords do not match." });
        } else {
            updateError({});
            updateLoading(true);
            try {
                const signUpResponse = await fetch("/api/signup", {
                    method: "POST",
                    body: JSON.stringify({ email, password }),
                });
                if (signUpResponse.status == 200) {
                    const signInResponse = await signIn("credentials", {
                        email,
                        password,
                        redirect: false,
                    });
                    if (signInResponse?.ok) {
                        toast({
                            title: "You have successfully signed up.",
                            status: "success",
                            duration: 2000,
                            isClosable: true,
                            position: "top-right",
                        });
                        setTimeout(() => router.replace("/dashboard"), 1000);
                    } else {
                        toast({
                            title: signInResponse?.error,
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                            position: "top-right",
                        });
                    }
                } else {
                    const json = await signUpResponse.json();
                    toast({
                        title: json.error,
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "top-right",
                    });
                }
            } catch (error: any) {
                console.error(error);
                toast({
                    title: error.message,
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                    position: "top-right",
                });
            } finally {
                updateLoading(false);
            }
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
                <Button
                    type="submit"
                    leftIcon={<FiUserPlus />}
                    isLoading={loading}
                >
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
    const [loading, updateLoading] = useState(false);

    const toast = useToast();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            updateError({ email: "Please enter an email." });
        } else if (!password) {
            updateError({ password: "Please enter a password." });
        } else if (!validateEmail(email)) {
            updateError({ email: "Please enter a valid email." });
        } else {
            updateError({});
            updateLoading(true);
            try {
                const signInResponse = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });
                if (signInResponse?.error) {
                    toast({
                        title: "Error!",
                        description: signInResponse?.error,
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "top-right",
                    });
                } else {
                    toast({
                        title: "Success!",
                        description: "You have successfully logged in.",
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                        position: "top-right",
                    });
                    setTimeout(() => router.replace("/dashboard"), 1000);
                }
            } catch (error) {
                console.error({ error });
                toast({
                    title: "Error!",
                    description: "Something went wrong.",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                    position: "top-right",
                });
            } finally {
                updateLoading(false);
            }
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
                <Button
                    type="submit"
                    rightIcon={<MdLogin />}
                    isLoading={loading}
                >
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
                destination: "/dashboard",
                permanent: false,
            },
        };
    return {
        props: {},
    };
};
