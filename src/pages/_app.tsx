import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  // Force black background on the document body
  useEffect(() => {
    // Set body and html background to black
    document.body.style.backgroundColor = 'black';
    document.documentElement.style.backgroundColor = 'black';
    
    // Prevent any white flashes by ensuring these styles persist
    const originalBackground = document.body.style.backgroundColor;
    
    return () => {
      document.body.style.backgroundColor = originalBackground;
    };
  }, []);

  return (
    <>
      <Head>
        <style jsx global>{`
          html, body {
            background-color: black !important;
            margin: 0;
            padding: 0;
          }
          
          #__next {
            background-color: black !important;
          }
        `}</style>
      </Head>
      <div style={{ backgroundColor: 'black', minHeight: '100vh' }}>
        <Component {...pageProps} />
      </div>
    </>
  );
} 