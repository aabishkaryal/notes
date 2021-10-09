import Head from "next/head";

import { ChakraProvider } from "@chakra-ui/react";
import { Provider as SessionProvider } from "next-auth/client";

import theme from "@utils/theme";

import { AppProps } from "next/app";

import "focus-visible/dist/focus-visible";

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <ChakraProvider theme={theme}>
                <Head>
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
                    />
                </Head>
                <Component {...pageProps} />
            </ChakraProvider>
        </SessionProvider>
    );
}
