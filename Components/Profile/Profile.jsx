import React, { useContext, useState, useEffect } from "react";
import { ChatAppContext } from "../../Context/ChatAppContext";
import Style from "./Profile.module.css";

const Profile = () => {
  const {
    account,
    userName,
    friendLists,
    friendMsg,
    updateUsername,
    createAccount,
    loading,
    error,
    success,
  } = useContext(ChatAppContext);

  const [isEditing, setIsEditing]   = useState(false);
  const [newName, setNewName]       = useState("");
  const [copied, setCopied]         = useState(false);
  const [saveMsg, setSaveMsg]       = useState("");
  const [avatarSeed, setAvatarSeed] = useState(0);
  const [mounted, setMounted]       = useState(false);

  useEffect(() => {
    setMounted(true);
    if (account) setAvatarSeed(parseInt(account.slice(2, 8), 16));
  }, [account]);

  const friendCount = friendLists?.length || 0;
  const msgCount    = friendMsg?.length   || 0;

  const handleCopy = () => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!newName.trim()) return;
    
    try {
      await updateUsername({ name: newName.trim() });
      setIsEditing(false);
      setNewName("");
      // The success message will be set in the context
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  // deterministic pixel avatar from wallet address
  const generateAvatar = (seed) => {
    const palette = ["#00ffc8", "#ff6b6b", "#ffd93d", "#6bceff", "#c77dff", "#ff9a3c"];
    const color   = palette[seed % palette.length];
    const cells   = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 3; col++) {
        if (((seed >> (row * 3 + col)) & 1) === 1) {
          cells.push({ row, col });
          if (col < 2) cells.push({ row, col: 4 - col });
        }
      }
    }
    return { color, cells };
  };

  const avatar = generateAvatar(avatarSeed);

  if (!mounted) return null;

  return (
    <div className={Style.page}>
      <div className={Style.scanlines} />

      <div className={Style.container}>

        {/* ── HEADER ── */}
        <div className={Style.header}>
          <span className={Style.tag}>// user.profile</span>
          <h1 className={Style.title}>PROFILE</h1>
          <p className={Style.subtitle}>on-chain identity</p>
        </div>

        {/* ── MAIN GRID ── */}
        <div className={Style.grid}>

          {/* LEFT — avatar + stats */}
          <div className={Style.left}>

            <div className={Style.avatarCard} style={{ "--accent": avatar.color }}>
              <div className={Style.avatarGlow} />
              <svg
                className={Style.avatarSvg}
                viewBox="0 0 50 50"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="50" height="50" fill="#0a0a14" />
                {avatar.cells.map((c, i) => (
                  <rect
                    key={i}
                    x={c.col * 10}
                    y={c.row * 10}
                    width="9"
                    height="9"
                    fill={avatar.color}
                    opacity="0.92"
                  />
                ))}
              </svg>
              <p className={Style.avatarHandle}>
                {account ? `0x${account.slice(2, 6).toUpperCase()}...` : "NO WALLET"}
              </p>
            </div>

            <div className={Style.statsRow}>
              <div className={Style.stat}>
                <span className={Style.statVal}>{friendCount}</span>
                <span className={Style.statKey}>FRIENDS</span>
              </div>
              <div className={Style.statDivider} />
              <div className={Style.stat}>
                <span className={Style.statVal}>{msgCount}</span>
                <span className={Style.statKey}>MESSAGES</span>
              </div>
              <div className={Style.statDivider} />
              <div className={Style.stat}>
                <span className={Style.statVal} style={{ color: account ? "#00ffc8" : "#ff6464" }}>
                  {account ? "ON" : "OFF"}
                </span>
                <span className={Style.statKey}>STATUS</span>
              </div>
            </div>

          </div>

          {/* RIGHT — info fields */}
          <div className={Style.right}>

            {/* Username */}
            <div className={Style.card}>
              <span className={Style.cardLabel}>[ USERNAME ]</span>

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
                      className={Style.btnSave}
                      onClick={handleSave}
                      disabled={loading || !newName.trim()}
                    >
                      {loading ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                    <button
                      className={Style.btnCancel}
                      onClick={() => { setIsEditing(false); setNewName(""); }}
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              ) : (
                <div className={Style.fieldRow}>
                  <span className={Style.fieldValue}>
                    {userName || <em className={Style.empty}>not set</em>}
                  </span>
                  <button className={Style.btnEdit} onClick={() => setIsEditing(true)}>
                    EDIT NAME
                  </button>
                </div>
              )}
            </div>

            {/* Wallet address */}
            <div className={Style.card}>
              <span className={Style.cardLabel}>[ WALLET ADDRESS ]</span>
              <div className={Style.fieldRow}>
                <span className={Style.address}>
                  {account
                    ? `${account.slice(0, 12)}...${account.slice(-10)}`
                    : "not connected"}
                </span>
                <button
                  className={`${Style.btnCopy} ${copied ? Style.btnCopied : ""}`}
                  onClick={handleCopy}
                  disabled={!account}
                >
                  {copied ? "COPIED ✓" : "COPY"}
                </button>
              </div>
              {account && (
                <span className={Style.fullAddr}>{account}</span>
              )}
            </div>

            {/* Network */}
            <div className={Style.card}>
              <span className={Style.cardLabel}>[ NETWORK ]</span>
              <div className={Style.networkRow}>
                <span className={Style.dot} />
                <span className={Style.networkName}>Localhost 8545</span>
                <span className={Style.chainId}>Chain ID: 1337</span>
              </div>
            </div>

            {/* Friends list */}
            {friendCount > 0 && (
              <div className={Style.card}>
                <span className={Style.cardLabel}>[ FRIENDS — {friendCount} ]</span>
                <div className={Style.friendList}>
                  {friendLists.slice(0, 5).map((f, i) => (
                    <div key={i} className={Style.friendRow}>
                      <span className={Style.arrow}>▸</span>
                      <span className={Style.friendName}>{f.name}</span>
                      <span className={Style.friendAddr}>
                        {f.pubkey ? `${f.pubkey.slice(0, 10)}...` : ""}
                      </span>
                    </div>
                  ))}
                  {friendCount > 5 && (
                    <span className={Style.more}>+{friendCount - 5} more</span>
                  )}
                </div>
              </div>
            )}

            {/* Feedback */}
            {(saveMsg || success || error) && (
              <div className={`${Style.feedback} ${error ? Style.feedbackErr : Style.feedbackOk}`}>
                {error || saveMsg || success}
              </div>
            )}

          </div>
        </div>

        <div className={Style.footer}>
          CHAT_BUDDY &nbsp;|&nbsp; DECENTRALIZED MESSAGING
        </div>

      </div>
    </div>
  );
};

export default Profile;
