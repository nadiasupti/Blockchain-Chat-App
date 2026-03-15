import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { ChatAppContext } from "../Context/ChatAppContext";
import Style from "../styles/Setting.module.css";

const Setting = () => {
  const { userName, account, updateUsername, loading, error, success } = useContext(ChatAppContext);
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName]     = useState("");
  const [saveMsg, setSaveMsg]     = useState("");

  const handleSave = async () => {
    if (!newName.trim()) return;
    await updateUsername({ name: newName.trim() });
    setSaveMsg("Name updated!");
    setIsEditing(false);
    setNewName("");
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handleDisconnect = () => {
    // MetaMask doesn't support programmatic disconnect —
    // best UX is to redirect to home and let them know
    router.push("/");
  };

  const shortAddr = account
    ? `${account.slice(0, 8)}...${account.slice(-6)}`
    : "Not Connected";

  return (
    <div className={Style.page}>
      <div className={Style.container}>

        <div className={Style.header}>
          <span className={Style.tag}>// account.settings</span>
          <h1 className={Style.title}>Settings</h1>
          <p className={Style.subtitle}>manage your profile & wallet</p>
        </div>

        <div className={Style.grid}>

          {/* ── Profile Card ── */}
          <div className={Style.card}>
            <div className={Style.cardHeader}>
              <span className={Style.cardIcon}>◈</span>
              <h2 className={Style.cardTitle}>Profile</h2>
            </div>

            <div className={Style.avatarRow}>
              <div className={Style.avatar}>
                {userName ? userName.slice(0, 2).toUpperCase() : "?"}
              </div>
              <div>
                <p className={Style.displayName}>{userName || "No name set"}</p>
                <p className={Style.walletShort}>{shortAddr}</p>
              </div>
            </div>

            <div className={Style.field}>
              <label className={Style.label}>DISPLAY NAME</label>
              {isEditing ? (
                <div className={Style.editBlock}>
                  <input
                    className={Style.input}
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    placeholder={userName || "enter new name..."}
                    autoFocus
                    maxLength={32}
                  />
                  <div className={Style.btnRow}>
                    <button
                      className={Style.btnPrimary}
                      onClick={handleSave}
                      disabled={loading || !newName.trim()}
                    >
                      {loading ? "SAVING..." : "SAVE"}
                    </button>
                    <button
                      className={Style.btnSecondary}
                      onClick={() => { setIsEditing(false); setNewName(""); }}
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              ) : (
                <div className={Style.nameRow}>
                  <span className={Style.nameVal}>{userName || <em className={Style.unset}>not set</em>}</span>
                  <button className={Style.btnOutline} onClick={() => setIsEditing(true)}>
                    EDIT
                  </button>
                </div>
              )}
            </div>

            {(saveMsg || success || error) && (
              <div className={`${Style.feedback} ${error ? Style.feedbackErr : Style.feedbackOk}`}>
                {error || saveMsg || success}
              </div>
            )}
          </div>

          {/* ── Wallet Card ── */}
          <div className={Style.card}>
            <div className={Style.cardHeader}>
              <span className={Style.cardIcon}>◎</span>
              <h2 className={Style.cardTitle}>Wallet</h2>
              <span className={`${Style.pill} ${account ? Style.pillGreen : Style.pillRed}`}>
                {account ? "CONNECTED" : "DISCONNECTED"}
              </span>
            </div>

            <div className={Style.field}>
              <label className={Style.label}>CONNECTED ADDRESS</label>
              <p className={Style.addrVal}>{account || "No wallet connected"}</p>
            </div>

            <div className={Style.field}>
              <label className={Style.label}>NETWORK</label>
              <div className={Style.networkRow}>
                <span className={Style.dot} />
                <span className={Style.netName}>Localhost 8545</span>
                <span className={Style.netId}>Chain: 1337</span>
              </div>
            </div>

            <div className={Style.btnGroup}>
              <button className={Style.btnDanger} onClick={handleDisconnect}>
                DISCONNECT
              </button>
              <button
                className={Style.btnOutline}
                onClick={() => window.open("https://metamask.io", "_blank")}
              >
                METAMASK ↗
              </button>
            </div>
          </div>

          {/* ── Preferences Card ── */}
          <div className={`${Style.card} ${Style.fullWidth}`}>
            <div className={Style.cardHeader}>
              <span className={Style.cardIcon}>⚙</span>
              <h2 className={Style.cardTitle}>App Preferences</h2>
            </div>
            <div className={Style.prefGrid}>
              {[
                { label: "Blockchain", value: "Hardhat Localhost" },
                { label: "Solidity",   value: "^0.8.24"           },
                { label: "Framework",  value: "Next.js"           },
                { label: "Web3",       value: "ethers.js v6"      },
                { label: "Storage",    value: "On-chain only"     },
                { label: "Version",    value: "v1.0.0"            },
              ].map((item, i) => (
                <div key={i} className={Style.prefItem}>
                  <span className={Style.prefLabel}>{item.label}</span>
                  <span className={Style.prefVal}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Setting;