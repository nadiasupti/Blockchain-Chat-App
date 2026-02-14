import React ,{ useState,useEffect, Children} from "react";

import { useRouter } from "next/router";

//INTERNAL import
import { ChechIfWalletConnected , connectWallet , connectingWithContract} from "../Utils/apifeature";

export const ChatAppContext =React.createContext();
export const ChatAppProvider =({ children }) => {
     //usestate
        const [account,setAccount] = useState("");
        const [userName ,setUserName] = useState("");
        const [friendLists ,setFriendLists] = useState([]);
        const [friendMsg ,setFriendMsg] = useState([]);
        const [loading ,setLoading] = useState(false);
        const [userLists ,setUserLists] = useState([]);
        const [error,setError] = useState("");
        const [success, setSuccess] = useState("");

    //chat user data
    const [currentUserName ,setCurrentUserName] = useState("");
    const [currentUserAddress ,setCurrentUserAddress] = useState("");

    const router = useRouter();
    //fetch data time of page data
    const fetchData = async()=>{
        try{
            //get contract
            const contract = await connectingWithContract();
            //get account
            const connectAccount = await connectWallet();
            setAccount(connectAccount);
            //get user name
            const userName = await contract.getUsername(connectAccount);
            setUserName(userName);
            //get my friendlist 
            const friendLists = await contract.getMyFriendList();
            setFriendLists(friendLists);
            //get all app userlist
            const userList = await contract.getAllAppUser();
            setUserLists(userList);

        }catch(error){
            // setError ("Please install and connect your wallet");
            console.log(error);
        }
    };
//     const fetchData = async () => {
//   try {
//     console.log("🔥 fetchData started");

//     const contract = await connectingWithContract();
//     console.log("📦 Contract:", contract);

//     if (!contract) {
//       setError("❌ Contract not connected");
//       return;
//     }

//     const connectAccount = await connectWallet();
//     console.log("👛 Account:", connectAccount);

//     setAccount(connectAccount);

//     const friendLists = await contract.getMyFriendList();
//     console.log("👥 Friend list:", friendLists);
//     setFriendLists(friendLists);

//     const userlist = await contract.getAllAppUser();
//     console.log("🌍 User list:", userlist);
//     setUserLists(userlist);

//   } catch (error) {
//     console.error("🚨 fetchData error:", error);
//     setError(error.message || "Something went wrong");
//   }
// };

//     useEffect(() => {
//         // fetchData();
//         if (typeof window === "undefined") return; // skip SSR

//   const init = async () => {
//     try {
//       const account = await ChechIfWalletConnected();
//       if (!account) setError("Please connect your wallet");
//       else setAccount(account);
//     } catch (err) {
//       setError("Please install and connect your wallet");
//     }
//   };

//   init();
//     },[]);
useEffect(() => {
  if (typeof window === "undefined") return;

  const init = async () => {
    try {
      const account = await ChechIfWalletConnected();
      if (!account) {
        setError("Please connect your wallet");
      } else {
        setAccount(account);
        await fetchData(); 
      }
    } catch (err) {
      setError("Please install and connect your wallet");
    }
  };

  init();
}, []);

 //read message
    const readMessage = async (friendAddress) =>{
        try {
            const contract = await connectingWithContract();
            const read =await contract.readMessage(friendAddress);
            setFriendMsg(read);
        } catch (error) {
             setFriendMsg([]); 
             console.log("No messages yet");        }
    };
    //create account
    const createAccount = async({name, accountAddress}) =>{
        try {
            // if(!name || !accountAddress)
            //     return setError("Name and AccountAddress , cannot be empty");

            const contract = await connectingWithContract();
            const getCreatedUser = await  contract.createAccount(name);
            setLoading(true);
            await getCreatedUser.wait();
            setLoading(false);
            // window.location.reload();
            setSuccess("Account Created Successfully!");
            await fetchData(); 
        } catch (error) {
             setError("ERROR WHILE CREATING YOUR ACCOUNT .PLEASE RELOAD YOUR BROWSER AGAIN");
           
        }
    };
    //add ur friends
    const addFriends = async({name,accountAddress})=>{
        try {
            // if (name || accountAddress)
            //     return setError("Please provibe your contract");
            if (!name || !accountAddress) return setError("Name or Address missing!"); 
            const contract= await connectingWithContract();
            const addMyFriend = await contract.addFriend(accountAddress,name);
            setLoading(true);
            await addMyFriend.wait();
            setLoading(false);
            router.push("/");
            // window.location.reload();
        } catch (error) {
            setError("Something went wrong while you are adding friends, try again!");
            console.log(error);
            
        }
    };
    //send message to ur friend
    const sendMessage= async({msg,address}) =>{
        try {
            // if(!msg || !address )
            //     return setError ("Please Type Your Message");
            const contract = await connectingWithContract();
            const addMessage = await contract.sendMessage(address,msg);
            setLoading(true);
            await addMessage.wait();
            setLoading(false);
            window.location.reload();
        } catch (error) {
            setError("Please reload and try again!");
        }
    };
    //read info of user
    const readUser= async({userAddress}) =>{
        try{
            const contract = await connectingWithContract();
            const userName = await contract.getUsername(userAddress);
            setCurrentUserName(userName);
            setCurrentUserAddress(userAddress);
        }catch(error){
            console.log("Error reading user", error);
  }
    };
    return(
        <ChatAppContext.Provider value ={{readMessage ,createAccount ,addFriends,sendMessage,readUser,connectWallet,ChechIfWalletConnected,account ,userName,friendLists,friendMsg,loading,userLists,error,success, currentUserName,currentUserAddress}}>  
            {children}

        </ChatAppContext.Provider>
    );
};
