
import React from "react";
import SettingStyle from "../styles/Settings.module.css";

const Terms = () => {
  const terms = [
    {
      title: "Decentralized System",
      desc: "This application is a decentralized chat system built on blockchain technology."
    },
    {
      title: "Gas Fees",
      desc: "Users are responsible for their own gas fees for on-chain interactions and message storage."
    },
    {
      title: "Immutability",
      desc: "Messages once sent cannot be deleted due to blockchain immutability."
    },
    {
      title: "User Responsibility",
      desc: "Users are fully responsible for their private keys and wallet security."
    }
  ];

  return (
    <div className={SettingStyle.container}>
      <div className={SettingStyle.header}>
        <h1>Terms of Use</h1>
        <p>Please read our terms and conditions carefully</p>
      </div>

      <div className={SettingStyle.cards_container}>
        {terms.map((el, i) => (
          <div key={i} className={SettingStyle.card}>
            <h3 style={{ color: "var(--primary-green)", marginBottom: "1rem" }}>
              {el.title}
            </h3>
            <p style={{ color: "#a0a0a0", lineHeight: "1.6" }}>
              {el.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Terms;