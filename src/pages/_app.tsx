import '../styles/globals.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/600.css'
import '@fontsource/jetbrains-mono/200.css'
import '@fontsource/material-icons'
import type { AppContext, AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { gql } from '@apollo/client';
import React, { useMemo, useEffect } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { useRouter } from 'next/router';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { useNavigate } from "react-router-dom";
import { Cluster } from '@solana/web3.js';
import client from '../client';
import withReactRouter from '../react-router';
import { ToastContainer } from 'react-toastify';
import { ViewerProvider } from './../providers/Viewer';
import 'react-toastify/dist/ReactToastify.css';

const network = WalletAdapterNetwork.Mainnet;

const CLUSTER_API_URL = "https://holaplex.rpcpool.com";

const clusterApiUrl = (cluster: Cluster): string => CLUSTER_API_URL;

function App({ Component, pageProps }: AppProps) {
  const navigate = useNavigate();

  const endpoint = useMemo(() => clusterApiUrl(network), []);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    []
  );

  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      navigate(url, { replace: true });
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router, navigate]);

  return (
    <ApolloProvider client={client}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider className="wallet-modal-theme">
            <ViewerProvider>
              <ToastContainer
                theme="dark"
                hideProgressBar={true}
                position='bottom-center'
                className="w-full max-w-full font-sans text-sm text-white bottom-4 sm:right-4 sm:left-auto sm:w-96 sm:translate-x-0 "
                toastClassName="bg-gray-900 bg-opacity-80 rounded-lg items-center"
              />
              <Component {...pageProps} />
            </ViewerProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ApolloProvider >
  );
}

export default withReactRouter(App);
