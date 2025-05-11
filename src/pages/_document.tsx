import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <style dangerouslySetInnerHTML={{
          __html: `
            body, html {
              background-color: black !important;
              margin: 0;
              padding: 0;
              height: 100%;
            }

            #__next {
              background-color: black !important;
              min-height: 100%;
            }

            /* Hide any content until CSS loads */
            body::before {
              content: "";
              display: block;
              position: fixed;
              top: 0;
              left: 0;
              height: 100%;
              width: 100%;
              background-color: black;
              z-index: 99999;
            }
            
            body.loaded::before {
              display: none;
            }
          `
        }} />
      </Head>
      <body className="bg-black">
        <script dangerouslySetInnerHTML={{
          __html: `
            // Add loaded class after a brief timeout
            setTimeout(function() {
              document.body.classList.add('loaded');
            }, 100);
          `
        }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 