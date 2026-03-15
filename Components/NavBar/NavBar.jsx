import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MdNotifications } from "react-icons/md";

// Internal imports
import Style from './NavBar.module.css';
import { ChatAppContext } from '../../Context/ChatAppContext';
import { Model, Error } from '../index';
import images from '../../assets';

const NavBar = () => {
  const menuItems = [
    { menu: "All Users", link: "alluser" },
    { menu: "Chat", link: "/" },
    { menu: "Contract", link: "contract" },
    { menu: "Setting", link: "setting" },
    { menu: "FAQS", link: "faqs" },
    { menu: "Terms of use", link: "terms" },
    // { menu: "Profile", link: "profile" },
  ];

  // States
  const [active, setActive] = useState(2);
  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const router = useRouter();
  // Context
  const { 
    account, 
    userName, 
    connectWallet, 
    error, 
    createAccount, 
    notifications, 
    setNotifications 
  } = useContext(ChatAppContext);

  useEffect(() => {
  if (!showNotif) return;
  let timeoutId;
  const handler = () => setShowNotif(false);
  timeoutId = setTimeout(() => {
    document.addEventListener("click", handler);
  }, 0);

  return () => {
    clearTimeout(timeoutId);
    document.removeEventListener("click", handler);
  };
}, [showNotif]);

  const handleNotificationToggle = () => {
    setShowNotif(!showNotif);
    if (!showNotif) {
      const readNotifications = notifications.map(n => ({
        ...n,
        read: true
      }));
      setNotifications(readNotifications);
    }
  };
  const handleLogoClick = async () => {
    if (!account) {
      await connectWallet();
    }
    setOpenModel(true);
  };
  const handleAccountClick = () => {
    if (userName) {
      router.push("/profile"); // already has account → go to profile
    } else {
      setOpenModel(true);      // no account yet → open create account modal
    }
  };
  return (
    <div className={Style.NavBar}>
      <div className={Style.NavBar_box}>
        <div className={Style.NavBar_box_left}>
          <div onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <Image src={images.logo} alt='logo' width={50} height={50} priority />
          </div>
        </div>

        <div className={Style.NavBar_box_right}>
          {/* Desktop Menu */}
          <div className={Style.NavBar_box_right_menu}>
            {menuItems.map((el, i) => (
              <div
                key={i}
                onClick={() => setActive(i + 1)}
                className={`${Style.NavBar_box_right_menu_items} ${
                  active === i + 1 ? Style.active_btn : ""
                }`}
              >
                <Link href={el.link} className={Style.NavBar_box_right_menu_items_link}>
                  {el.menu}
                </Link>
              </div>
            ))}
          </div>

          {/* Notification Bell Section */}
          <div className={Style.notification_icon}>
            <div onClick={handleNotificationToggle} style={{ cursor: 'pointer', display: 'flex' }}>
              <MdNotifications size={25} />
              {/*unread thakle red dot */}
              {notifications.filter(n => !n.read).length > 0 && (
                <span className={Style.badge}>
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </div>

            {/* Notification Dropdown */}
            {showNotif && (
              <div className={Style.notification_dropdown} onClick={(e) => e.stopPropagation()}>
                <h4>Notifications</h4>
                <div className={Style.notif_list}>
                  {notifications.length === 0 ? (
                    <p style={{ fontSize: '12px', textAlign: 'center', padding: '10px' }}>
                      No new messages
                    </p>
                  ) : (
                    notifications.map((n, i) => (
                      <div key={i} className={Style.notif_item}>
                        <div className={Style.notif_item_info}>
                          <strong>{n.from.slice(0, 6)}...</strong>
                          <p>{n.message.slice(0, 20)}...</p>
                        </div>
                        <small>{n.time.split(',')[1]}</small>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <button className={Style.clear_btn} 
                  // onClick={() => setNotifications([])}
                  onClick={() => {
                  setNotifications([]);
                  localStorage.removeItem("user_notifications");
                }}
                  >
                    Clear All
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Connect Wallet / Account Button */}
          <div className={Style.NavBar_box_right_connect}>
            {account === "" ? (
              <button className="neon_button" onClick={() => connectWallet()}>
                <span>Connect Wallet</span>
              </button>
            ) : (
              <button onClick={handleAccountClick}>
                <Image
                  src={userName ? images.accountName : images.create2}
                  alt="Account image"
                  width={20}
                  height={20}
                />
                <small>{userName || "Create Account"}</small>
              </button>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className={Style.NavBar_box_right_open} onClick={() => setOpen(true)}>
            <Image src={images.open} alt="open" width={30} height={30} />
          </div>
        </div>
      </div>

      {/* Mobile Menu Version */}
      {open && (
        <div className={Style.mobile_menu}>
          {menuItems.map((el, i) => (
            <div
              key={i}
              onClick={() => setActive(i + 1)}
              className={`${Style.mobile_menu_items} ${
                active === i + 1 ? Style.active_btn : ""
              }`}
            >
              <Link href={el.link} className={Style.mobile_menu_items_link}>
                {el.menu}
              </Link>
            </div>
          ))}
          <p className={Style.mobile_menu_btn}>
            <Image
              src={images.close}
              alt='close'
              width={50}
              height={50}
              onClick={() => setOpen(false)}
            />
          </p>
        </div>
      )}

      {/* Modal & Error Handling */}
      {openModel && (
        <div className={Style.modelBox}>
          <Model
            openBox={setOpenModel}
            title="Welcome To"
            head="Chat Buddy"
            info="Please enter your details to get started."
            smallInfo="Your wallet address is automatically detected."
            functionName={createAccount}
            address={account}
            image={images.hero}
          />
        </div>
      )}
      {error !== "" && <Error error={error} />}
    </div>
  );
};

export default NavBar;