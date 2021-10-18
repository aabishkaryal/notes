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

const heading =
    (size: string): ChakraComponent<"div"> =>
    ({ children, ...props }) =>
        (
            <Heading {...props} size={size}>
                {children}
            </Heading>
        );

export const componentMap = {
    h1: heading("2xl"),
    h2: heading("xl"),
    h3: heading("lg"),
    h4: heading("md"),
    h5: heading("sm"),
    h6: heading("xs"),
    a: Link,
    img: Image,
    li: ListItem,
    ol: OrderedList,
    ul: UnorderedList,
    p: Text,
    code: Code,
    em: chakra(Text, { baseStyle: { fontStyle: "italic" } }),
    strong: chakra(Text, { baseStyle: { fontWeight: "bold" } }),
    blockquote,
};
