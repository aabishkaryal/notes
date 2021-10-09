import React, { useState } from "react";

import {
    InputGroup,
    Input,
    InputRightElement,
    IconButton,
    InputLeftElement,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { RiLockPasswordFill } from "react-icons/ri";

type Props = { placeholder: string };

export function PasswordInput({ placeholder }: Props) {
    const [show, toggleShow] = useState(false);
    return (
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
    );
}
