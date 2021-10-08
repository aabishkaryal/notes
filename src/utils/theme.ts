import { extendTheme, ThemeConfig } from "@chakra-ui/react";

import { createBreakpoints } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
    initialColorMode: "light",
    useSystemColorMode: false,
};

const breakpoints = createBreakpoints({
    sm: "30em",
    md: "48em",
    lg: "62em",
    xl: "80em",
    "2xl": "96em",
});

const theme = extendTheme({ config, breakpoints });

export default theme;
