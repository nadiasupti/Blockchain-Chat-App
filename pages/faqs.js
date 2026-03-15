import React, { useState } from "react";
import Style from "../styles/FAQs.module.css";

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Getting Started",
      items: [
        {
          q: "How do I connect my wallet?",
          a: "Click the 'Connect Wallet' button in the top-right corner. Make sure MetaMask is installed and set to Localhost 8545 (Chain ID: 1337). The app will prompt you to switch networks automatically if needed."
        },
        {
          q: "How do I create an account?",
          a: "After connecting your wallet, click your wallet button or the logo. A modal will appear — enter your display name and confirm. This triggers a blockchain transaction, so you'll need to approve it in MetaMask and pay a small gas fee."
        },
        {
          q: "Can I use any wallet?",
          a: "Currently the app supports MetaMask. Any EVM-compatible wallet that supports Localhost/Hardhat networks should work. Make sure it's configured for Chain ID 1337 and RPC http://127.0.0.1:8545."
        },
      ]
    },
    {
      category: "Messaging",
      items: [
        {
          q: "How do I send a message?",
          a: "You must be friends with someone first. Go to All Users, add them as a friend, then open the Chat page. Select the friend from your list on the left and type in the message box at the bottom. Press Enter or click Send."
        },
        {
          q: "Can I delete messages?",
          a: "No. Messages are stored permanently on the blockchain. Due to the immutable nature of blockchain technology, once a message is sent it cannot be edited or deleted. Think carefully before sending."
        },
        {
          q: "Are messages private?",
          a: "Messages are stored on-chain and technically readable by anyone with access to the blockchain. This is a demonstration app — do not send sensitive or private information through it."
        },
      ]
    },
    {
      category: "Friends & Users",
      items: [
        {
          q: "How do I add a friend?",
          a: "Navigate to 'All Users' from the menu. You'll see all registered accounts. Click 'Add Friend' on any user — this sends a blockchain transaction. Once confirmed, they appear in your friends list and you can start chatting."
        },
        {
          q: "Why can't I add myself as a friend?",
          a: "The smart contract enforces a rule: you cannot add your own wallet address as a friend. This is intentional — messaging yourself is not supported."
        },
        {
          q: "Can I remove a friend?",
          a: "Friend removal is not implemented in the current contract version. Once added, a friend relationship is permanent on-chain. This is a planned feature for a future version."
        },
      ]
    },
    {
      category: "Gas & Fees",
      items: [
        {
          q: "What are gas fees?",
          a: "Gas fees are small amounts of ETH paid to the blockchain network to process transactions. Every write operation — creating an account, adding a friend, sending a message — costs gas. On Localhost/Hardhat, test ETH is free and pre-funded."
        },
        {
          q: "Why is my transaction failing?",
          a: "Common reasons: insufficient ETH balance, wrong network selected in MetaMask, the contract is not deployed at the expected address, or the Hardhat node is not running. Check the console for the specific error message."
        },
      ]
    },
  ];

  const allItems = faqs.flatMap((cat, ci) =>
    cat.items.map((item, ii) => ({ ...item, category: cat.category, id: `${ci}-${ii}` }))
  );

  return (
    <div className={Style.page}>
      <div className={Style.container}>

        <div className={Style.header}>
          <span className={Style.tag}>// help.faqs</span>
          <h1 className={Style.title}>FAQs</h1>
          <p className={Style.subtitle}>frequently asked questions</p>
        </div>

        {/* category sections */}
        {faqs.map((cat, ci) => (
          <div key={ci} className={Style.section}>
            <div className={Style.sectionHeader}>
              <span className={Style.sectionDot} />
              <h2 className={Style.sectionTitle}>{cat.category}</h2>
            </div>

            <div className={Style.accordionGroup}>
              {cat.items.map((item, ii) => {
                const id    = `${ci}-${ii}`;
                const isOpen = openIndex === id;
                return (
                  <div
                    key={ii}
                    className={`${Style.accordion} ${isOpen ? Style.accordionOpen : ""}`}
                  >
                    <button
                      className={Style.question}
                      onClick={() => setOpenIndex(isOpen ? null : id)}
                    >
                      <span>{item.q}</span>
                      <span className={`${Style.chevron} ${isOpen ? Style.chevronOpen : ""}`}>
                        ›
                      </span>
                    </button>
                    {isOpen && (
                      <div className={Style.answer}>
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default FAQs;