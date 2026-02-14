// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ChatApp {

    struct Friend {
        address pubkey;
        string name;
    }

    struct User {
        string name;
        Friend[] friendList;
    }

    struct Message {
        address sender;
        uint256 timestamp;
        string msg;
    }

    struct AllUserStruct {
        string name;
        address accountAddress;
    }

    AllUserStruct[] getAllUsers;

    mapping(address => User) userList;
    mapping(bytes32 => Message[]) allMessages;

    // check user exists
    function checkUserExists(address pubkey) public view returns (bool) {
        return bytes(userList[pubkey].name).length > 0;
    }

    // create account
    function createAccount(string calldata name) external {
        require(!checkUserExists(msg.sender), "User already exists");
        require(bytes(name).length > 0, "Username cannot be empty");

        userList[msg.sender].name = name;
        getAllUsers.push(AllUserStruct(name, msg.sender));
    }

    // get username
    function getUsername(address pubkey) external view returns (string memory) {
        require(checkUserExists(pubkey), "User not registered");
        return userList[pubkey].name;
    }

    // add friend
    function addFriend(address friend_key, string calldata name) external {
        require(checkUserExists(msg.sender), "Create an account first");
        require(checkUserExists(friend_key), "User not registered");
        require(msg.sender != friend_key, "Cannot add yourself");
        require(!checkAlreadyFriends(msg.sender, friend_key), "Already friends");

        _addFriend(msg.sender, friend_key, name);
        _addFriend(friend_key, msg.sender, userList[msg.sender].name);
    }

    function checkAlreadyFriends(address pubkey1, address pubkey2) internal view returns (bool) {
        for (uint256 i = 0; i < userList[pubkey1].friendList.length; i++) {
            if (userList[pubkey1].friendList[i].pubkey == pubkey2) {
                return true;
            }
        }
        return false;
    }

    function _addFriend(address me, address friend_key, string memory name) internal {
        userList[me].friendList.push(Friend(friend_key, name));
    }
    //getmyfriend
    function getMyFriendList() external view returns (Friend[] memory) {
        return userList[msg.sender].friendList;
    }

    function _getChatCode(address pubkey1, address pubkey2) internal pure returns (bytes32) {
        return pubkey1 < pubkey2
            ? keccak256(abi.encodePacked(pubkey1, pubkey2))
            : keccak256(abi.encodePacked(pubkey2, pubkey1));
    }

    function sendMessage(address friend_key, string calldata _msg) external {
        require(checkUserExists(msg.sender), "Create account first");
        require(checkUserExists(friend_key), "User not registered");
        require(checkAlreadyFriends(msg.sender, friend_key), "Not friends");

        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        allMessages[chatCode].push(Message(msg.sender, block.timestamp, _msg));
    }

    function readMessage(address friend_key) external view returns (Message[] memory) {
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        return allMessages[chatCode];
    }
//get all app user
    function getAllAppUser() public view returns (AllUserStruct[] memory) {
        return getAllUsers;
    }
}
