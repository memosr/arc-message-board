// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract MessageBoard {
    struct Message {
        address author;
        string content;
        uint256 timestamp;
    }

    Message[] public messages;

    event MessagePosted(address indexed author, string content, uint256 timestamp);

    function postMessage(string calldata content) external {
        require(bytes(content).length > 0, "Message cannot be empty");
        require(bytes(content).length <= 280, "Message too long");
        
        messages.push(Message({
            author: msg.sender,
            content: content,
            timestamp: block.timestamp
        }));

        emit MessagePosted(msg.sender, content, block.timestamp);
    }

    function getMessages() external view returns (Message[] memory) {
        return messages;
    }

    function getMessageCount() external view returns (uint256) {
        return messages.length;
    }
}
