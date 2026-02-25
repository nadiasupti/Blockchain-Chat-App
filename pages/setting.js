
import React, { useContext } from "react";
import { ChatAppContext } from "../Context/ChatAppContext";
import Style from "../styles/alluser.module.css";
import SettingStyle from "../styles/Settings.module.css";

const Setting = () => {
  const { userName, account } = useContext(ChatAppContext);

  return (
    <div className={SettingStyle.container}>
      <div className={SettingStyle.header}>
        <h1>Account Settings</h1>
        <p>Manage your profile and wallet information</p>
      </div>

      <div className={SettingStyle.cards_container}>
        {/* Profile Card */}
        <div className={SettingStyle.card}>
          <h2 style={{ color: "var(--primary-green)", marginBottom: "1.5rem" }}>Profile Info</h2>
          <div className={SettingStyle.info_group}>
            <label>Display Name</label>
            <h3 style={{ color: "var(--primary-green)", marginTop: "0.5rem" }}>
              {userName || "Not Set"}
            </h3>
          </div>
          <div className={SettingStyle.btn_group}>
            <button>Edit Profile</button>
            <button>Update Name</button>
          </div>
        </div>

        {/* Wallet Card */}
        <div className={SettingStyle.card}>
          <h2 style={{ color: "var(--primary-green)", marginBottom: "1.5rem" }}>Wallet Info</h2>
          <div className={SettingStyle.info_group}>
            <label>Connected Wallet</label>
            <p style={{ color: "#a0a0a0", marginTop: "0.5rem", wordBreak: "break-all" }}>
              {account || "Not Connected"}
            </p>
          </div>
          <div className={SettingStyle.btn_group}>
            <button>Disconnect</button>
            <button>Switch Wallet</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;