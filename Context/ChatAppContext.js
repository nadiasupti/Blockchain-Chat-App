import React ,{ useState,useEffect, Children} from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

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
        const [notifications, setNotifications] = useState([]);

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
            // 
            const cleanFriends = friendLists.map((f) => ({
            pubkey: f[0],
            name: f[1]
        }));
        setFriendLists(cleanFriends);

        const userList = await contract.getAllAppUser();
        const uniqueUsers = [];
        const seenAddresses = new Set();

        userList.forEach((u) => {
            if (!seenAddresses.has(u.accountAddress.toLowerCase())) {
                seenAddresses.add(u.accountAddress.toLowerCase());
                uniqueUsers.push({
                    name: u.name,
                    accountAddress: u.accountAddress
                });
            }
        });
        
        setUserLists(uniqueUsers);
        const cleanAllUsers = userList.map((u) => ({
            name: u.name,
            accountAddress: u.accountAddress
        }));
        setUserLists(cleanAllUsers);

        }catch(error){
            // setError ("Please install and connect your wallet");
            console.log(error);
        }
    };
// ================= NOTIFICATION LISTENER =================
// const listenToNotifications = async (userAddress) => {
//     try {
//         const contract = await connectingWithContract();
//         if (!userAddress) return;

//         contract.removeAllListeners("MessageNotification");

//         console.log("Listening for messages for:", userAddress);

//         contract.on("MessageNotification", (from, to, timestamp, message) => {
//             console.log("EVENT RECEIVED!", { from, to, message });
            
//             if (to.toLowerCase() === userAddress.toLowerCase()) {
//                 const newNotification = {
//                     from,
//                     message,
//                     time: new Date(Number(timestamp) * 1000).toLocaleString(),
//                     read: false,
//                 };

//                 setNotifications((prev) => [newNotification, ...prev]);
//                 toast.info(`New message from ${from.slice(0, 6)}...`, {
//                     position: "top-right",
//                     autoClose: 5000,
//                 });
//             }
//         });
//     } catch (error) {
//         console.log("Notification listener error:", error);
//     }
// };

// useEffect(() => {
//     const init = async () => {
//         try {
//             const connectedAccount = await ChechIfWalletConnected();
//             if (connectedAccount) {
//                 setAccount(connectedAccount);
//                 await fetchData(); 
//                 await listenToNotifications(connectedAccount);
//             }
//         } catch (err) {
//             console.log("Initialization error", err);
//         }
//     };

//     init();

//     return () => {
//         connectingWithContract().then(contract => {
//             contract.removeAllListeners("MessageNotification");
//         }).catch(e => console.log(e));
//     };
// }, [account]); 
const listenToNotifications = async (currentUser) => {
    try {
        const contract = await connectingWithContract();
        if (!currentUser) return;

        contract.removeAllListeners("MessageNotification");

        contract.on("MessageNotification", (from, to, timestamp, message) => {
            if (to.toLowerCase() === currentUser.toLowerCase()) {
                const newNotification = {
                    from,
                    message,
                    time: new Date(Number(timestamp) * 1000).toLocaleString(),
                    read: false,
                    id: Date.now()
                };

                setNotifications((prev) => {
                    const updated = [newNotification, ...prev];
                    localStorage.setItem("user_notifications", JSON.stringify(updated));
                    return updated;
                });
                
                toast.info(`New message from ${from.slice(0, 6)}...`, {
                        position: "top-right",
                    });
            }
        });
    } catch (error) {
        console.log("Notification error:", error);
    }
};

useEffect(() => {
    const init = async () => {
            const connectedAccount = await ChechIfWalletConnected();
            if (connectedAccount) {
                setAccount(connectedAccount);
                await fetchData();
                await listenToNotifications(connectedAccount);
            }
        };

        init();
    const savedNotifications = localStorage.getItem("user_notifications");
    if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
    }
return () => {
            connectingWithContract().then(contract => {
                contract.removeAllListeners("MessageNotification");
            }).catch(e => console.log(e));
        };
    }, [account]);
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
        //     if (!msg || !address) return setError("Message or Address is empty!");

        // const contract = await connectingWithContract();
        // setLoading(true);
            // if(!msg || !address )
            //     return setError ("Please Type Your Message");
            const contract = await connectingWithContract();
            const addMessage = await contract.sendMessage(address,msg);
            setLoading(true);
            await addMessage.wait();
            setLoading(false);
            // window.location.reload();
            await readMessage(address);
        } catch (error) {
            setError("Message failed to send!");
            console.log("Send Message Error:", error);
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
        <ChatAppContext.Provider value ={{readMessage ,createAccount ,addFriends,sendMessage,readUser,connectWallet,ChechIfWalletConnected,account ,
        userName,friendLists,friendMsg,loading,userLists,error,success, currentUserName,currentUserAddress ,notifications,setNotifications,}}>  
            {children}

        </ChatAppContext.Provider>
    );
};
