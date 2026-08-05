import { useEffect } from 'react'
import '../styles/globals.css'
import { initializeUrlParams } from '../lib/urlParams'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    initializeUrlParams()
  }, [])

  return <Component {...pageProps} />
}
