import '@/styles/globals.scss';
import { Provider } from 'react-redux';
import store from '../store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import Head from 'next/head';
import { SessionProvider } from "next-auth/react"
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-tooltip/dist/react-tooltip.css";
import Router from 'next/router';
import { useState } from 'react';
import GridLoaderSpinner from '@/components/pageLoader';
import  NProgress  from 'nprogress';




let persistor = persistStore(store);


export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const [loading, setLoading] = useState(false)
  Router.events.on('routeChangeStart', (url) => {
    NProgress.start()
    setLoading(true)
  })
  Router.events.on('routeChangeComplete', (url) => {
    NProgress.done()
    setLoading(false)
  })
  return (
    <>
      <Head>
        <title>WellMeds</title>
        <meta name="description" content="Wellmeds-Buy Your Care From Your Home" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      </Head>
      <SessionProvider session={session}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <PayPalScriptProvider deferLoading={true} options={{ "client-id": process.env.PAYPAL_CLIENT_ID }}>
              <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
              {/* {loading && <GridLoaderSpinner loading={loading} />} */}

              <Component {...pageProps} />
            </PayPalScriptProvider>
          </PersistGate>
        </Provider>
      </SessionProvider>
    </>)
}
