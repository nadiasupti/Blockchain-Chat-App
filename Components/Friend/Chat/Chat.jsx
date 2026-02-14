import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
// internal import
import Style from './Chat.module.css';
import images from '../../../assets';
import { converTime } from "../../../Utils/apifeature";
import { Loader } from "../../index";

const Chat = ({ functionName, readMessage, friendMsg, account, userName, Loading, currentUserName, currentUserAddress ,readUser, }) => {
  // use state
  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState({
    name: "",
    address: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    setChatData(router.query);
    // readMessage(router.query.address);
  }, [router.isReady, router.query]);

useEffect(() => {
    if (chatData.address) {
      readMessage(chatData.address);
      readUser({ userAddress: chatData.address });
    }
  }, [chatData.address]);
  return (
    <div className={Style.Chat}>
      {/* user info section */}
      {currentUserName && currentUserAddress ? (
        <div className={Style.Chat_user_info}>
          <Image src={images.accountName} alt="image" width={70} height={70} />
          <div className={Style.Chat_user_info_box}>
            <h4>{currentUserName}</h4>
            <p className={Style.show}>{currentUserAddress}</p>
          </div>
        </div>
      ) : (
        <div className={Style.no_user}>No User Found</div>
      )}

      {/* message box section */}
      <div className={Style.Chat_box_box}>
        <div className={Style.Chat_box}>
          <div className={Style.Chat_box_inner}>
            {friendMsg.map((el, i) => (
              <div key={i + 1} className={Style.Message_Wrapper}>
                {/* Check if sender is the friend or the user */}
                {el.sender.toLowerCase() === chatData.address?.toLowerCase() ? (
                  <div className={Style.Chat_box_left}>
                    <div className={Style.Chat_box_left_title}>
                      <Image src={images.accountName} alt="image" width={50} height={50} />
                      <span>
                        {chatData.name} <small>{converTime(el.timestamp)}</small>
                      </span>
                    </div>
                    <p className={Style.msg_text_left}>{el.msg}</p>
                  </div>
                ) : (
                  <div className={Style.Chat_box_right}>
                    <div className={Style.Chat_box_right_title}>
                      <span>
                        You <small>{converTime(el.timestamp)}</small>
                      </span>
                    </div>
                    <p className={Style.msg_text_right}>{el.msg}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {currentUserName && currentUserAddress ? (
          <div className={Style.Chat_box_send}>
            <div className={Style.Chat_box_send_img}>
              <Image src={images.smile} alt="smile" width={50} height={50} />
              <input type="text"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              />
              <Image src={images.file} alt="file" width={50} height={50} />
              {Loading == true?(<Loader />):(
                <Image src={images.send}
              alt="file" width={50} height={50} 
              onClick={()=>functionName({msg: message, address: chatData.address})}/>
          )}
          </div>
      </div>
        ):(
        ""
  )}
   </div>
  </div>
  );
};

export default Chat;