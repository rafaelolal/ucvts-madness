import 'normalize.css'
import '@/styles/global.scss'
import type { AppProps } from 'next/app'
import { AppWrapper } from '@/context/state'
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppWrapper>
      <Script
        type='text/javascript'
        src='/ucvts-madness/js/bootstrap.bundle.min.js'
        strategy='beforeInteractive'
      />

      <Component {...pageProps} />
    </AppWrapper>
  )
}
