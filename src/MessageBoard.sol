// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract MessageBoard {
    struct Message {
        address author;
        string content;
        uint256 timestamp;
    }

    struct ReactionData {
        string emoji;
        uint256 count;
    }

    Message[] public messages;

    // GM: day (unix timestamp / 86400) => address => has said GM
    mapping(uint256 => mapping(address => bool)) private _gmByDay;
    mapping(uint256 => uint256) private _gmDailyCount;

    // Reactions: messageId => emoji => count
    mapping(uint256 => mapping(string => uint256)) private _reactionCounts;
    // Reactions: messageId => emoji => address => has reacted
    mapping(uint256 => mapping(string => mapping(address => bool))) private _hasReacted;
    // Track which emojis have been used per message for enumeration
    mapping(uint256 => string[]) private _reactionEmojis;
    mapping(uint256 => mapping(string => bool)) private _emojiTracked;

    event MessagePosted(address indexed author, string content, uint256 timestamp);
    event GMSaid(address indexed who, uint256 timestamp);
    event ReactionAdded(uint256 indexed messageId, address indexed reactor, string emoji);

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

    function sayGM() external {
        uint256 today = block.timestamp / 1 days;
        if (!_gmByDay[today][msg.sender]) {
            _gmByDay[today][msg.sender] = true;
            _gmDailyCount[today]++;
        }
        emit GMSaid(msg.sender, block.timestamp);
    }

    function getDailyGMCount() external view returns (uint256) {
        uint256 today = block.timestamp / 1 days;
        return _gmDailyCount[today];
    }

    function addReaction(uint256 messageId, string calldata emoji) external {
        require(messageId < messages.length, "Message does not exist");
        require(bytes(emoji).length > 0, "Emoji cannot be empty");
        require(!_hasReacted[messageId][emoji][msg.sender], "Already reacted");

        if (!_emojiTracked[messageId][emoji]) {
            _reactionEmojis[messageId].push(emoji);
            _emojiTracked[messageId][emoji] = true;
        }

        _hasReacted[messageId][emoji][msg.sender] = true;
        _reactionCounts[messageId][emoji]++;

        emit ReactionAdded(messageId, msg.sender, emoji);
    }

    function getReactions(uint256 messageId) external view returns (ReactionData[] memory) {
        require(messageId < messages.length, "Message does not exist");

        string[] storage emojis = _reactionEmojis[messageId];
        ReactionData[] memory result = new ReactionData[](emojis.length);

        for (uint256 i = 0; i < emojis.length; i++) {
            result[i] = ReactionData({
                emoji: emojis[i],
                count: _reactionCounts[messageId][emojis[i]]
            });
        }

        return result;
    }
}
