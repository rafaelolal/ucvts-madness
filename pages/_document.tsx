import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link rel='icon' href='/bhm/favicon.ico' />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
