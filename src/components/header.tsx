import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
    Flex,
    IconButton,
    Heading,
    HStack,
    useColorMode,
    Button,
    useBreakpointValue,
} from "@chakra-ui/react";
import { BiLogOut } from "react-icons/bi";
import React from "react";
import { signOut } from "next-auth/client";
import { useRouter } from "next/router";

type Props = {};

export function Header({}: Props) {
    const { colorMode, toggleColorMode } = useColorMode();

    const router = useRouter();
    return (
        <Flex
            justifyContent="space-between"
            padding={{ base: 3 }}
            boxShadow="md"
            alignItems="center"
        >
            <Heading size="lg">Notes</Heading>
            <HStack spacing={{ base: 2 }}>
                <IconButton
                    aria-label={
                        colorMode == "dark"
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                    }
                    onClick={toggleColorMode}
                    icon={colorMode == "dark" ? <SunIcon /> : <MoonIcon />}
                    size={useBreakpointValue({ base: "sm", md: "md" })}
                    variant="ghost"
                    isRound
                />
                <Button
                    colorScheme="blue"
                    variant="ghost"
                    leftIcon={<BiLogOut />}
                    onClick={() => {
                        signOut({ redirect: false });
                        router.replace("auth?login");
                    }}
                    size={useBreakpointValue({ base: "sm", md: "md" })}
                >
                    Log Out
                </Button>
            </HStack>
        </Flex>
    );
}
