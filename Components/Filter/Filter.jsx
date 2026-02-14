import React, { useState,useContext } from 'react';
import Image from 'next/image';
//internal import
import Style from './Filter.module.css' ;
import { ChatAppContext }  from '../../Context/ChatAppContext';
import {Model} from '../index';
import images from '../../assets';

const Fliter = () => {
  // const {userLists ,addFriends ,setAddFriend} = useContext(ChatAppContext);
    const { userLists ,addFriends} = useContext(ChatAppContext);

  const [addFriend, setAddFriend] = useState(false);
  return (
    <div className={Style.Filter}>
      <div className={Style.Filter_box}>
        <div className={Style.Filter_box_left}>
          <div className={Style.Filter_box_left_search}>
            <Image src={images.search} alt='image' width={20} height={20}/>
            <input type='text' placeholder='Search User Name...' />
             </div>
        </div>
        <div className={Style.Filter_box_right}>
          <button onClick={()=>setAddFriend(true)}>
            <Image src={images.clear} alt="clear" width={20} height={20}/>
            Clear Chat
            </button>
            <button onClick={()=>setAddFriend(true)}>
            <Image src={images.user} alt="clear" width={20} height={20}/>
            Add Friend     
          </button>
        </div>
        </div>
        {/* model componet */}
        {addFriend && (
        <div className={Style.Filter_model}>
          <Model openBox={setAddFriend}
          title="Welcome To"
          head="Chat Buddy"
          info="Kindly provide your friend's contract address and name to add them to your friend list."
          smallInfo="Ensure the address is correct to avoid transaction errors."
          image={images.hero}
          functionName={addFriend}
          // eita ektu dekha lagbe beparta 
          // functionName={addFriends} 
          />
        </div>
  )}
  </div>
  );
};

export default Fliter;