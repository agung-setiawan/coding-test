import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head>
                {/* ✅ Bootstrap Icons CDN */}
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
                />
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}
