import React, { useEffect, useState,useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';

//internal import
import Style from './NavBar.module.css' ;
import { ChatAppContext }  from '../../Context/ChatAppContext';
import {Model,Error} from '../index';
import images from '../../assets';
import { ST } from 'next/dist/shared/lib/utils';


const NavBar = () => {
  const menuItems = [
    {
      menu: "All Users",
      link: "alluser",
    },
    {
      menu: "Chat",
      link: "/",
    },
    {
      menu: "Contract",
      link: "/",
    },
    {
      menu: "Setting",
      link: "/",
    },
    {
      menu: "FAQS",
      link: "/",
    },
    {
      menu: "Terms of use",
      link: "/",
    },
  ];
  //usestate
  const[active ,setActive] = useState(2);
  const[open ,setOpen] = useState(false);
  const[openModel ,setOpenModel] = useState(false);
  const{ account , userName, connectWallet , error, createAccount } = useContext(ChatAppContext);

  return (
    <div className={ Style.NavBar}>
      <div className={ Style.NavBar_box}>
        <div className={ Style.NavBar_box_left}>
          <Image src={images.logo} alt='logo' width={50} height={50}/>
          </div> 
          <div className={ Style.NavBar_box_right}>
            {/* desktop version */}

          <div className={Style.NavBar_box_right_menu}>
          {menuItems.map((el, i) => (
            <div
              key={i}
              onClick={() => setActive(i + 1)}
              className={`${Style.NavBar_box_right_menu_items} ${
                active === i + 1 ? Style.active_btn : ""
              }`}
            >
              <Link
                href={el.link}
                className={Style.NavBar_box_right_menu_items_link}
              >
                {el.menu}
              </Link>
              </div>
            ))}
          </div>
          {/* mobile version */}
          {open &&(
            <div className={Style.mobile_menu}>
          {menuItems.map((el, i) => (
            <div
              key={i}
              onClick={() => setActive(i + 1)}
              className={`${Style.mobile_menu_items} ${
                active === i + 1 ? Style.active_btn : ""
              }`}
            >
              <Link
                href={el.link}
                className={Style.mobile_menu_items_link}
              >
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
              onClick={()=>setOpen(false)}
              />
            </p>
          </div>
          )}
          {/* connect wallet */}
          <div className={Style.NavBar_box_right_connect}>
            {account == ""?
            (
            // <button onClick={()=> connectWallet()} >
            //   {""}
            //   <span>Connect Wallet</span>
            // </button>
            
            <button className="neon_button" onClick={() => connectWallet()}>
            <span>Connect Wallet</span>
            </button>
            ) : (
              <button onClick={()=> setOpenModel(true)}>
                {""}
                <Image src={userName ? images.accountName : images.create2}
                alt=" Account image"
                width={20}
                height={20}/>
                {''}
                <small>{userName || "Create Account"}</small>
              </button>
            )}
          </div>
            <div className ={Style.NavBar_box_right_open} onClick={() =>setOpen(true)}>
              <Image src={images.open} alt='open' width={30} height={30}/>
            </div>
        </div> 
      </div> 
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
        {error == "" ? "" : <Error error={error}/>}
   </div>
  );
};

export default NavBar;