import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { NextIntlProvider } from "next-intl";

export default function App({ Component, pageProps, router }: AppProps) {
    return (
        <>
            <Head>
                <title>WellPose</title>
            </Head>
            <NextIntlProvider messages={pageProps.messages}>
                <Component {...pageProps} key={router.route} />
            </NextIntlProvider>
        </>
    );
}
