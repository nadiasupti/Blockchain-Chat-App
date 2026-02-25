
import React, { useContext } from "react";
import Style from "../styles/alluser.module.css";
import SettingStyle from "../styles/Settings.module.css";
import { ChatAppContext } from "../Context/ChatAppContext";

const Contract = () => {
  const { account } = useContext(ChatAppContext);
  // const contractAddress = "0x974cd759d76000764636682e67064dB57337d7C0";
  return (
    <div className={SettingStyle.container}>
      <div className={SettingStyle.header}>
        <h1>Smart Contract Details</h1>
        <p>Verify contract interactions and blockchain details</p>
      </div>

      <div className={SettingStyle.cards_container}>
        {/* Contract Card */}
        <div className={SettingStyle.card}>
          <h2 style={{ color: "var(--primary-green)", marginBottom: "1.5rem" }}>Contract Info</h2>
          <div className={SettingStyle.info_group}>
            <label>Contract Address</label>
            <p style={{ color: "var(--primary-green)", marginTop: "0.5rem", wordBreak: "break-all" }}>
              0x974cd759d76000764636682e67064dB57337d7C0
            </p>
          </div>
          <div className={SettingStyle.info_group}>
            <label>Network</label>
            <p style={{ color: "#a0a0a0", marginTop: "0.5rem" }}>Hardhat Localhost / Polygon Mumbai</p>
          </div>
        </div>

        {/* Wallet Card */}
        <div className={SettingStyle.card}>
          <h2 style={{ color: "var(--primary-green)", marginBottom: "1.5rem" }}>Your Wallet</h2>
          <div className={SettingStyle.info_group}>
            <label>Wallet Address</label>
            <p style={{ color: "#a0a0a0", marginTop: "0.5rem", wordBreak: "break-all" }}>
              {account || "Not Connected"}
            </p>
          </div>
          <div className={SettingStyle.info_group}>
            <label>Status</label>
            <p style={{ color: account ? "var(--primary-green)" : "#ff4444", marginTop: "0.5rem" }}>
              {account ? "✓ Connected" : "✗ Disconnected"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contract;