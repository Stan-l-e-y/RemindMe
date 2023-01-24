import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Source_Sans_3 } from '@next/font/google';
import NavBar from '@/components/NavBar';
import { AddEventProvider } from '@/context/NavBarContext';

const sourceSans3 = Source_Sans_3({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${sourceSans3.className} bg-blueGrey-500 `}>
      <AddEventProvider>
        <NavBar>
          <Component {...pageProps} />
        </NavBar>
      </AddEventProvider>
    </main>
  );
}
