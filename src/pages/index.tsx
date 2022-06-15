import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import {Verify} from '../components/Verify';
import {Sell} from '../components/Sell';
import {Buy} from '../components/Buy';
import {Web3AppContext} from '../contexts/Web3AppContext';
import web3app from '../utils/web3app';
import {Web3AppInitFrame} from '../components/Web3AppInitFrame';

export default function Home()
{

  return (
    <Web3AppContext.Provider value={web3app}>
      <Web3AppInitFrame>
        <div className={styles.container}>
          <Head>
            <title>SDK Demo</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <main className={styles.main}>
            <h1 className={styles.title}>SDKDemo</h1>

            <div className={styles.component}>
              <Buy />
            </div>
            <div className={styles.component}>
              <Sell />
            </div>
            <div className={styles.component}>
              <Verify />
            </div>
          </main>
        </div>
      </Web3AppInitFrame>
    </Web3AppContext.Provider>
  );
}
