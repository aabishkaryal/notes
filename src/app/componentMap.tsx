import React from "react";

import {
    Link,
    chakra,
    Text,
    Code,
    Image,
    ListItem,
    OrderedList,
    UnorderedList,
    ChakraComponent,
    Heading,
} from "@chakra-ui/react";

const blockquote = chakra("blockquote", {
    baseStyle: {
        _before: {
            color: "#ccc",
            fontSize: "4em",
            lineHeight: "0.1em",
            marginRight: "0.25em",
            verticalAlign: "-0.4em",
        },
        borderLeft: "10px solid #ccc",
        margin: "1.5em 10px",
        padding: "0.5em 10px",
    },
});

const H =
    (size: string): ChakraComponent<"div"> =>
    ({ children, ...props }) =>
        (
            <Heading {...props} size={size}>
                {children}
            </Heading>
        );
const Italic = chakra(Text, { baseStyle: { fontStyle: "italic" } });
const Bold = chakra(Text, { baseStyle: { fontWeight: "bold" } });

export const componentMap = {
    h1: H("2xl"),
    h2: H("xl"),
    h3: H("lg"),
    h4: H("md"),
    h5: H("sm"),
    h6: H("xs"),
    a: Link,
    img: Image,
    li: ListItem,
    ol: OrderedList,
    ul: UnorderedList,
    p: Text,
    code: Code,
    em: Italic,
    strong: Bold,
    blockquote,
};
