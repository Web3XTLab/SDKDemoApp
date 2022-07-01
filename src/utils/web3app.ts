import Web3 from "web3";
import { provider } from "web3-core";
import { AbiItem } from "web3-utils";
import { TransactionReceipt } from "ethereum-abi-types-generator";
import AppStoreAbi from "@/src/abis/AppStore.json";
import { ContractContext } from "@/src/types/AppStore";

interface IWeb3App {
  web3Provider: null | provider;
  contracts: {
    AppStore: ContractContext | null;
  };
  web3: null | Web3;
  account?: string;
  networkId?: number;
  networkAddress?: string;
  init: () => Promise<IWeb3App | null>;
  initWeb3: () => Promise<IWeb3App | null>;
  initContract: (web3instance: Web3) => Promise<IWeb3App | null>;
  getAccount: () => Promise<string>;
  checkAvailable: () => boolean;
  sell: (
    name: string,
    tokenURI: string,
    price: string
  ) => Promise<TransactionReceipt | null>;
  buy: (tokenId: string, price: string) => Promise<TransactionReceipt | null>;
  verify: (tokenId: string) => Promise<boolean>;
  totalCount: () => Promise<string>;
  tokenURI: (tokenId: string) => Promise<string>;
  tokenURIs: () => Promise<string[]>;
  getAppInfo: (tokenId: string) => Promise<Record<string, any>>;
  getTokenIdsBySeller: (seller: string) => Promise<string[] | undefined>;
  getTokenIdsByBuyer: (buyer: string) => Promise<string[] | undefined>;
}

const App: IWeb3App = {
  web3Provider: null,
  contracts: {
    AppStore: null,
  },
  web3: null,

  account: undefined,
  networkId: undefined,
  networkAddress: undefined,

  init: async () => {
    if (App.web3) return App;
    return await App.initWeb3();
  },

  initWeb3: async () => {
    try {
      // Modern dapp browsers...
      if ((window as any).ethereum) {
        App.web3Provider = (window as any).ethereum;
        try {
          // Request account access
          await (window as any).ethereum.request({
            method: "eth_requestAccounts",
          });
        } catch (e) {
          // User denied account access...
          console.error("User denied account access");
          throw new Error(e as any);
        }
      }
      // Legacy dapp browsers...
      else if ((window as any).web3) {
        App.web3Provider = (window as any).web3.currentProvider;
      }
      // IF no injected web3 instance is detected, fall back to Ganache
      else {
        App.web3Provider = new Web3.providers.HttpProvider(
          "http://localhost:7545"
        );
      }
      // App.web3 = new Web3("ws://127.0.0.1:7545");
      App.web3 = new Web3(App.web3Provider);

      return await App.initContract(App.web3);
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  initContract: async (web3instance) => {
    const networkId = await web3instance.eth.net.getId();
    if (!networkId) return null;
    App.networkId = networkId;

    const deployedNetwork =
      AppStoreAbi.networks[
        `${networkId}` as keyof typeof AppStoreAbi["networks"]
      ];
    if (!deployedNetwork?.address) return null;
    App.networkAddress = deployedNetwork?.address;

    App.contracts.AppStore = new web3instance.eth.Contract(
      AppStoreAbi.abi as AbiItem[],
      deployedNetwork.address
    ) as any as ContractContext;

    try {
      await App.getAccount();
      (window as any).ethereum.once("accountsChanged", () => {
        location.reload();
      });
      (window as any).ethereum.once("chainChanged", () => {
        location.reload();
      });
    } catch (e) {
      console.error(e);
    }

    return App;
  },

  getAccount: async () => {
    if (App.account) return App.account;
    const accounts = (await App.web3?.eth.getAccounts()) || [];
    App.account = accounts[0];
    return App.account;
  },

  // TODO: https://docs.metamask.io/guide/ethereum-provider.html
  // import detectEthereumProvider from '@metamask/detect-provider';
  checkAvailable: () => {
    return !!(window as any).ethereum;
  },

  sell: async (name, tokenURI, price) => {
    try {
      const account = await App.getAccount();

      // App.contracts.AppStore?.events
      //   .OnSell({})
      //   .on('data', event => {
      //     console.log('sell', event);
      //   })
      //   .on('error', error => {
      //     console.log(error);
      //   });

      const result = await App.contracts.AppStore?.methods
        .sell(name, tokenURI, price)
        .send({ from: account });

      if (!result) return null;
      return result;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  buy: async (tokenId, price) => {
    try {
      const account = await App.getAccount();

      // App.contracts.AppStore?.events
      //   .OnBuy({})
      //   .on('data', event => {
      //     console.log('buy', event);
      //   })
      //   .on('error', error => {
      //     console.log(error);
      //   });

      const result = await App.contracts.AppStore?.methods
        .buy(tokenId)
        .send({ from: account, value: price });
      if (!result) return null;
      return result;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  verify: async (tokenId) => {
    try {
      const account = await App.getAccount();

      const result = await (
        App.contracts.AppStore?.methods.verify(tokenId, account) as any
      ).call();

      return !!result;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  totalCount: async () => {
    try {
      const count = await App.contracts.AppStore?.methods.totalCount().call();
      if (!count) return "0";
      return count;
    } catch (e) {
      console.error(e);
      return "0";
    }
  },

  tokenURI: async (tokenId) => {
    try {
      const uri = await App.contracts.AppStore?.methods
        .getTokenURI(tokenId)
        .call();
      if (!uri) return "";
      return uri;
    } catch (e) {
      console.error(e);
      return "";
    }
  },

  tokenURIs: async () => {
    const items = [];
    try {
      const count = await App.contracts.AppStore?.methods.totalCount().call();
      for (let i = 0; i < Number(count); i++) {
        const item = await App.contracts.AppStore?.methods
          .getTokenURI(`${i}`)
          .call();
        if (item) items.push(item);
      }
    } catch (e) {
      console.error(e);
    } finally {
      return items;
    }
  },

  getAppInfo: async (tokenId) => {
    const name =
      (await App.contracts.AppStore?.methods.getAppName(tokenId).call()) || "";
    const price =
      (await App.contracts.AppStore?.methods.getAppPrice(tokenId).call()) || "";
    const seller =
      (await App.contracts.AppStore?.methods.getAppSeller(tokenId).call()) ||
      "";
    const buyers =
      (await App.contracts.AppStore?.methods.getAppBuyers(tokenId).call()) ||
      [];

    return {
      name,
      price,
      seller,
      buyers,
    };
  },

  getTokenIdsBySeller: async (seller) => {
    let soldTokenIds: string[] | undefined;
    try {
      soldTokenIds = await App.contracts.AppStore?.methods
        .getTokenIdsBySeller(seller)
        .call();
    } catch (e) {
      console.error(e);
    }
    return soldTokenIds;
  },

  getTokenIdsByBuyer: async (buyer) => {
    let boughtTokenIds: string[] | undefined;
    try {
      boughtTokenIds = await App.contracts.AppStore?.methods
        .getTokenIdsByBuyer(buyer)
        .call();
    } catch (e) {
      console.error(e);
    }
    return boughtTokenIds;
  },
};

export default App;
