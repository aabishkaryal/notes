import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
    InputGroup,
    Input,
    InputRightElement,
    IconButton,
} from "@chakra-ui/react";
import React, { useState } from "react";

type Props = { placeholder: string };

export function PasswordInput({ placeholder }: Props) {
    const [show, toggleShow] = useState(false);
    return (
        <InputGroup>
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
                />
            </InputRightElement>
        </InputGroup>
    );
}
