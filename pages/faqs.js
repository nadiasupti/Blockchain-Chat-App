import React from "react";
import SettingStyle from "../styles/Settings.module.css";

const FAQs = () => {
  const faqList = [
    { q: "How to connect wallet?", a: "Click on 'Connect Wallet' button on the top right." },
    { q: "Is this chat decentralized?", a: "Yes, all messages are stored on the blockchain." },
    { q: "How to add friends?", a: "Go to 'All Users' and click 'Add Friend' on their profile." },
    { q: "What are gas fees?", a: "Gas fees are network costs for transactions on the blockchain." }
  ];

  return (
    <div className={SettingStyle.container}>
      <div className={SettingStyle.header}>
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about our chat app</p>
      </div>

      <div className={SettingStyle.cards_container}>
        {faqList.map((el, i) => (
          <div key={i} className={SettingStyle.card}>
            <h3 style={{ color: "var(--primary-green)", marginBottom: "1rem" }}>
              {el.q}
            </h3>
            <p style={{ color: "#a0a0a0", lineHeight: "1.6" }}>
              {el.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;