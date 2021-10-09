import React, { useState } from "react";

import {
    Text,
    InputGroup,
    Input,
    InputRightElement,
    IconButton,
    InputLeftElement,
    FormControl,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { RiLockPasswordFill } from "react-icons/ri";

type Props = {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
};

export function PasswordInput({ placeholder, value, onChange, error }: Props) {
    const [show, toggleShow] = useState(false);
    return (
        <FormControl>
            <InputGroup>
                <InputLeftElement>
                    <InputLeftElement pointerEvents="none" color="gray.500">
                        <RiLockPasswordFill />
                    </InputLeftElement>
                </InputLeftElement>
                <Input
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    autoComplete="new-password"
                    variant="filled"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    isInvalid={!!error}
                />
                <InputRightElement>
                    <IconButton
                        aria-label="Toggle password show"
                        icon={show ? <ViewIcon /> : <ViewOffIcon />}
                        onClick={() => toggleShow(!show)}
                        variant="ghost"
                        isRound
                        size="sm"
                        color="gray.500"
                    />
                </InputRightElement>
            </InputGroup>
            {error && (
                <Text color="red" fontSize="xs">
                    {error}
                </Text>
            )}
        </FormControl>
    );
}
