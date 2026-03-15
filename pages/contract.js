import React, { useContext, useState } from "react";
import { ChatAppContext } from "../Context/ChatAppContext";
import Style from "../styles/Contract.module.css";
import { ChatAppAddress } from "../Context/constants";

const Contract = () => {
  const { account } = useContext(ChatAppContext);
  const [copiedContract, setCopiedContract] = useState(false);
  const [copiedWallet, setCopiedWallet]     = useState(false);

  const handleCopy = (text, which) => {
    navigator.clipboard.writeText(text);
    if (which === "contract") {
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 2000);
    } else {
      setCopiedWallet(true);
      setTimeout(() => setCopiedWallet(false), 2000);
    }
  };

  const contractABI = [
    "createAccount(string name)",
    "getUsername(address pubkey)",
    "addFriend(address friend_key, string name)",
    "sendMessage(address friend_key, string msg)",
    "readMessage(address friend_key)",
    "getMyFriendList()",
    "getAllAppUser()",
    "updateUsername(string name)",
  ];

  return (
    <div className={Style.page}>
      <div className={Style.container}>

        {/* header */}
        <div className={Style.header}>
          <span className={Style.tag}>// blockchain.contract</span>
          <h1 className={Style.title}>Contract Details</h1>
          <p className={Style.subtitle}>on-chain verification & interaction info</p>
        </div>

        <div className={Style.grid}>

          {/* ── Contract Info ── */}
          <div className={Style.card}>
            <div className={Style.cardHeader}>
              <span className={Style.cardIcon}>◈</span>
              <h2 className={Style.cardTitle}>Smart Contract</h2>
              <span className={Style.badge}>DEPLOYED</span>
            </div>

            <div className={Style.field}>
              <label className={Style.label}>CONTRACT ADDRESS</label>
              <div className={Style.addressBox}>
                <code className={Style.code}>
                  {ChatAppAddress || "0x974cd759d76000764636682e67064dB57337d7C0"}
                </code>
                <button
                  className={`${Style.copyBtn} ${copiedContract ? Style.copied : ""}`}
                  onClick={() => handleCopy(ChatAppAddress || "0x974cd759d76000764636682e67064dB57337d7C0", "contract")}
                >
                  {copiedContract ? "✓ COPIED" : "COPY"}
                </button>
              </div>
            </div>

            <div className={Style.row2}>
              <div className={Style.field}>
                <label className={Style.label}>NETWORK</label>
                <div className={Style.networkPill}>
                  <span className={Style.dot} />
                  Localhost 8545
                </div>
              </div>
              <div className={Style.field}>
                <label className={Style.label}>CHAIN ID</label>
                <p className={Style.value}>1337</p>
              </div>
              <div className={Style.field}>
                <label className={Style.label}>LANGUAGE</label>
                <p className={Style.value}>Solidity ^0.8.24</p>
              </div>
            </div>

            <div className={Style.field}>
              <label className={Style.label}>LICENSE</label>
              <p className={Style.value}>MIT</p>
            </div>
          </div>

          {/* ── Wallet Info ── */}
          <div className={Style.card}>
            <div className={Style.cardHeader}>
              <span className={Style.cardIcon}>◎</span>
              <h2 className={Style.cardTitle}>Your Wallet</h2>
              <span className={`${Style.badge} ${account ? Style.badgeGreen : Style.badgeRed}`}>
                {account ? "CONNECTED" : "DISCONNECTED"}
              </span>
            </div>

            <div className={Style.field}>
              <label className={Style.label}>WALLET ADDRESS</label>
              {account ? (
                <div className={Style.addressBox}>
                  <code className={Style.code}>{account}</code>
                  <button
                    className={`${Style.copyBtn} ${copiedWallet ? Style.copied : ""}`}
                    onClick={() => handleCopy(account, "wallet")}
                  >
                    {copiedWallet ? "✓ COPIED" : "COPY"}
                  </button>
                </div>
              ) : (
                <p className={Style.notConnected}>Wallet not connected</p>
              )}
            </div>

            <div className={Style.row2}>
              <div className={Style.field}>
                <label className={Style.label}>PROVIDER</label>
                <p className={Style.value}>MetaMask</p>
              </div>
              <div className={Style.field}>
                <label className={Style.label}>RPC URL</label>
                <p className={Style.value}>http://127.0.0.1:8545</p>
              </div>
            </div>
          </div>

          {/* ── ABI Functions ── */}
          <div className={`${Style.card} ${Style.fullWidth}`}>
            <div className={Style.cardHeader}>
              <span className={Style.cardIcon}>⟨/⟩</span>
              <h2 className={Style.cardTitle}>ABI Functions</h2>
              <span className={Style.badge}>{contractABI.length} METHODS</span>
            </div>
            <div className={Style.abiGrid}>
              {contractABI.map((fn, i) => (
                <div key={i} className={Style.abiItem}>
                  <span className={Style.fnKeyword}>fn</span>
                  <code className={Style.fnName}>{fn}</code>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contract;