import React, { useState,useContext } from 'react';
import Image from 'next/image';
//internal import
import Style from './Model.module.css' ;
import { ChatAppContext }  from '../../Context/ChatAppContext';
import {Loader} from '../../Components/index';
import images from '../../assets';
const Model = ({openBox,address,title,head,info,smallInfo,image,functionName}) => {
  //use state
  // const [name, setName] =useState(ChatAppContext);
  const [name, setName] = useState("");
  const [accountAddress,setAccountAddress] =useState("");
  const { loading, success } = useContext(ChatAppContext);

  return (
    <div className={Style.Model}>
      <div className={Style.Model_box}>
        <div className={Style.Model_box_left}>
          <Image src={image} alt="buddy" width={700} height={700} />
        </div>
          <div className={Style.Model_box_right}>
            <h1>
              {title} <span>{head}</span>
            </h1>
            <p>{info}</p>
            <small>{smallInfo}</small>
            {
              loading== true ?(
                <Loader/>
              ) : (
            <div className={Style.Model_box_right_name}>
              <div className={Style.Model_box_right_name_info}>
                <Image src={images.username} alt="user" width={30} height={30}/>
                <input type='text' 
                placeholder="your name" 
                onChange={(e)=> setName(e.target.value)}/>
              </div>
                <div className={Style.Model_box_right_name}>
              <div className={Style.Model_box_right_name_info}>
                <Image src={images.account} alt="user" width={30} height={30}/>
                <input type='text'
                 placeholder={address||"Enter address..."}
                 onChange={(e)=> setAccountAddress(e.target.value)}/>
              </div>
              <div className={Style.Model_box_right_name_btn}>
                <button onClick={()=> functionName({name,accountAddress})}>
                  {""}
                  <Image src={images.send} alt="send" width={30} height={30} />
                  {""}
                  Submit
                </button>
                <button onClick={()=> openBox(false)}>
                  {""}
                  <Image src={images.close} alt="close" width={30} height={30} />
                  {""}
                  Cancel
                </button>
              </div>
              {success && (
                <p style={{ color: "green", marginTop: "10px" }}>
              {success}
              </p>
          )}
            </div>
          </div>
              )
            }
            
      </div>
    </div>
 </div>
  );
};

export default Model;