import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Source_Sans_3 } from '@next/font/google';

const sourceSans3 = Source_Sans_3({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={sourceSans3.className}>
      <Component {...pageProps} />
    </main>
  );
}
