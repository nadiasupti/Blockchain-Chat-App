import React, { useState } from "react";
import Style from "../styles/Terms.module.css";

const Terms = () => {
  const [agreed, setAgreed] = useState(false);

  const sections = [
    {
      number: "01",
      title: "Decentralized System",
      icon: "⬡",
      content: "This application is a decentralized messaging system built on Ethereum-compatible blockchain technology. All data is stored on-chain and governed by smart contracts. No central server stores or controls your messages or account data.",
      highlight: "No central authority. No servers. You own your data."
    },
    {
      number: "02",
      title: "Gas Fees & Transactions",
      icon: "◈",
      content: "Every write operation — creating an account, adding a friend, sending a message, or updating your username — is an on-chain transaction. You are solely responsible for the gas fees associated with these transactions. On the local Hardhat network, test ETH is free. On any live network, real fees apply.",
      highlight: "You pay gas. The app cannot cover transaction costs."
    },
    {
      number: "03",
      title: "Message Immutability",
      icon: "◉",
      content: "Messages stored on the blockchain are permanent and immutable. Once a message is sent, it cannot be edited, recalled, or deleted by anyone — including you, the recipient, or the developers of this application. Think carefully before sending any message.",
      highlight: "Sent messages cannot be deleted. Ever."
    },
    {
      number: "04",
      title: "Private Key Responsibility",
      icon: "⬢",
      content: "You are solely responsible for the security of your wallet and private keys. Never share your seed phrase or private key with anyone. The developers of this application have no ability to recover lost wallets or funds. Loss of your private key means permanent loss of access to your account.",
      highlight: "Lose your key, lose your account. No recovery possible."
    },
    {
      number: "05",
      title: "No Privacy Guarantee",
      icon: "◎",
      content: "All messages and account data are stored publicly on the blockchain. Anyone with access to the blockchain data can read them. Do not use this application to send confidential, financial, legal, or personal information. This is a demonstration application and should be treated as such.",
      highlight: "This is a public blockchain. Assume all data is readable."
    },
    {
      number: "06",
      title: "No Warranty",
      icon: "◇",
      content: "This software is provided as-is, without any warranty of any kind. The developers make no guarantees about uptime, message delivery, data integrity, or fitness for any particular purpose. Use at your own risk.",
      highlight: "Use at your own risk. No guarantees provided."
    },
  ];

  return (
    <div className={Style.page}>
      <div className={Style.container}>

        <div className={Style.header}>
          <span className={Style.tag}>// legal.terms</span>
          <h1 className={Style.title}>Terms of Use</h1>
          <p className={Style.subtitle}>please read carefully before using chat buddy</p>
        </div>

        <div className={Style.sections}>
          {sections.map((s, i) => (
            <div key={i} className={Style.section} style={{ animationDelay: `${i * 0.06}s` }}>
              <div className={Style.sectionLeft}>
                <span className={Style.number}>{s.number}</span>
                <div className={Style.connector} />
              </div>
              <div className={Style.sectionRight}>
                <div className={Style.sectionHeader}>
                  <span className={Style.icon}>{s.icon}</span>
                  <h2 className={Style.sectionTitle}>{s.title}</h2>
                </div>
                <p className={Style.content}>{s.content}</p>
                <div className={Style.highlightBox}>
                  <span className={Style.highlightDot}>▸</span>
                  <p className={Style.highlight}>{s.highlight}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* agree bar */}
        <div className={`${Style.agreeBar} ${agreed ? Style.agreeBarDone : ""}`}>
          <label className={Style.agreeLabel}>
            <input
              type="checkbox"
              className={Style.checkbox}
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className={Style.checkmark} />
            <span className={Style.agreeText}>
              I have read and understood the terms of use
            </span>
          </label>
          {agreed && (
            <span className={Style.agreedBadge}>✓ ACKNOWLEDGED</span>
          )}
        </div>

      </div>
    </div>
  );
};

export default Terms;