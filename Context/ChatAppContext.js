import React ,{ useState,useEffect,useRef, Children} from "react";
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
    // contractRef stores the contract so cleanup can remove listeners from the SAME instance
    const contractRef = useRef(null);

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
        // const cleanAllUsers = userList.map((u) => ({
        //     name: u.name,
        //     accountAddress: u.accountAddress
        // }));
        // setUserLists(cleanAllUsers);

        }catch(error){
            // setError ("Please install and connect your wallet");
            console.log(error);
        }
    };
// ================= NOTIFICATION LISTENER =================
const listenToNotifications = async (currentUser) => {
    try {
        // const contract = await connectingWithContract();
        if (!currentUser) return;
        const contract = await connectingWithContract();
        contractRef.current = contract;
        
contractRef.current.removeAllListeners("MessageNotification");

            contractRef.current.on("MessageNotification", (from, to, timestamp, message) => {
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
        const savedNotifications = localStorage.getItem("user_notifications");
        if (savedNotifications) {
            setNotifications(JSON.parse(savedNotifications));
        }

        const init = async () => {
            const connectedAccount = await ChechIfWalletConnected();
            if (connectedAccount) {
                setAccount(connectedAccount);
                await fetchData();
                await listenToNotifications(connectedAccount);
            }
        };

        init();
        return () => {
            if (contractRef.current) {
                contractRef.current.removeAllListeners("MessageNotification");
            }
        };

    }, []); 
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
            setError(""); // Clear any previous errors
            setSuccess(""); // Clear any previous success messages
            
            const contract = await connectingWithContract();
            const getCreatedUser = await  contract.createAccount(name);
            setLoading(true);
            await getCreatedUser.wait();
            setLoading(false);
            setSuccess("Account Created Successfully!");
            await fetchData(); 
        } catch (error) {
            setLoading(false);
            console.log("createAccount error:", error);
            
            if (error.message.includes("User already exists")) {
                setError("Account already exists!");
            } else if (error.message.includes("Username cannot be empty")) {
                setError("Username cannot be empty");
            } else {
                setError("ERROR WHILE CREATING YOUR ACCOUNT. PLEASE RELOAD YOUR BROWSER AGAIN");
            }
        }
    };
    //add ur friends
    const addFriends = async({name,accountAddress})=>{
        try {
            setError(""); // Clear any previous errors
            setSuccess(""); // Clear any previous success messages
            
            if (!name || !accountAddress) {
                setError("Name or Address missing!"); 
                return;
            }
            
            const contract = await connectingWithContract();
            if (!contract) {
                setError("Failed to connect to contract. Please check your wallet.");
                return;
            }
            
            setLoading(true);
            const addMyFriend = await contract.addFriend(accountAddress, name);
            await addMyFriend.wait();
            
            setLoading(false);
            setSuccess("Friend added successfully!");
            await fetchData(); // Refresh friend list
            
            // Small delay before redirect
            setTimeout(() => {
                router.push("/");
            }, 1000);
            
        } catch (error) {
            setError("Something went wrong while you are adding friends, try again!");
            console.log(error);
            // setLoading(false);
            // console.log("Full error object:", error);
            // console.log("Error message:", error?.message);
            // console.log("Error reason:", error?.reason);
            // console.log("Error code:", error?.code);
            
            // // Provide specific error messages
            // const errorMsg = error?.reason || error?.message || String(error);
            
            // if (errorMsg.includes("User already")) {
            //     setError("Already friends with this user!");
            // } else if (errorMsg.includes("Cannot add yourself")) {
            //     setError("You cannot add yourself as a friend!");
            // } else if (errorMsg.includes("User not registered")) {
            //     setError("User not registered. Please check the address!");
            // } else if (errorMsg.includes("Create an account first")) {
            //     setError("Please create an account first!");
            // } else if (errorMsg.includes("user rejected")) {
            //     setError("Transaction rejected by user.");
            // } else {
            //     setError(`Failed: ${errorMsg}`);
            // }
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
        }finally {
            // loading was stuck true forever if sendMessage threw an error, moved setLoading(false) to finally to ensure it always clears
            setLoading(false);
        }
    };
    // update my username
const updateUsername = async ({ name }) => {
    try {
        setError(""); // Clear any previous errors
        setSuccess(""); // Clear any previous success messages
        
        if (!name) {
            setError("Name cannot be empty");
            return;
        }
        
        const contract = await connectingWithContract();
        setLoading(true);
        const tx = await contract.updateUsername(name);
        await tx.wait();
        
        setLoading(false);
        setSuccess("Name updated successfully!");
        await fetchData(); // refresh userName in context
    } catch (error) {
        setLoading(false);
        console.log("updateUsername error:", error);
        
        if (error.message.includes("User not registered")) {
            setError("User not registered. Please create an account first.");
        } else if (error.message.includes("revert")) {
            setError("Failed to update name. Please try again.");
        } else {
            setError("Failed to update name. Please try again.");
        }
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
        userName,friendLists,friendMsg,loading,userLists,error,success, currentUserName,currentUserAddress ,notifications,setNotifications,updateUsername,}}>  
            {children}

        </ChatAppContext.Provider>
    );
};