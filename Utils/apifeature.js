import { ethers } from "ethers";
import { ChatAppAddress, ChatAppABI } from "../Context/constants";

const LOCAL_CHAIN_ID_HEX = "0x539"; // 1337

const ensureLocalNetwork = async () => {
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  if (chainId === LOCAL_CHAIN_ID_HEX) return true;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: LOCAL_CHAIN_ID_HEX }],
    });
    return true;
  } catch (switchError) {
    if (switchError?.code !== 4902) return false;

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: LOCAL_CHAIN_ID_HEX,
          chainName: "Localhost 8545",
          rpcUrls: ["http://127.0.0.1:8545"],
          nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        },
      ],
    });
    return true;
  }
};

// check wallet
export const ChechIfWalletConnected = async () => {
  try {
    if (!window.ethereum) return null;

    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    return accounts[0] ?? null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// connect wallet
export const connectWallet = async () => {
  try {
    if (!window.ethereum) return null;

    const chainReady = await ensureLocalNetwork();
    if (!chainReady) return null;

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    return accounts[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

// contract helper
const fetchContract = async (signer) =>
  new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

export const connectingWithContract = async () => {
  try {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return null;
    }

    const chainReady = await ensureLocalNetwork();
    if (!chainReady) {
      alert("Please switch MetaMask to Localhost 8545 (chainId 1337)");
      return null;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const code = await provider.getCode(ChatAppAddress);

    // Prevent transactions to an EOA/wrong address when network/address mismatch happens.
    if (!code || code === "0x") {
      alert("Contract not found on this network. Deploy and update Context/constants.js");
      return null;
    }

    const contract = await fetchContract(signer);
    return contract;
  } catch (error) {
    console.log("connectingWithContract error:", error);
    return null;
  }
};

// time convert
export const converTime = (time) => {
  const newTimer = new Date(Number(time) * 1000);
  const realTime = 
    newTimer.getHours() +
    ":" +
    newTimer.getMinutes() +
    ":" +
    newTimer.getSeconds() +
    "  Date: " +
    newTimer.getDate() +
    "/" +
    (newTimer.getMonth() + 1) +
    "/" +
    newTimer.getFullYear();
    
  return realTime;
  // const newTimer = new Date(Number(time.toNumber())) ;
  // const realTime = 
  //  newTimer.getHours()+
  //  "/"+
  //   newTimer.getMinutes()+
  //   "/"+
  //   newTimer.getSeconds()+
  //   "Date:"+
  //   newTimer.getDate()+
  //   "/"+
  //   (newTimer.getMonth() + 1)+
  //   "/"+
  //   newTimer.getFullYear();
  // return realTime;
  // const newTime = new Date(Number(time) * 1000);

  // return `${newTime.getHours()}:${newTime.getMinutes()}:${newTime.getSeconds()}
  // Date: ${newTime.getDate()}/${newTime.getMonth() + 1}/${newTime.getFullYear()}`;
};