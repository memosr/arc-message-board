// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {MessageBoard} from "../src/MessageBoard.sol";

contract DeployScript is Script {
    function run() public {
        vm.startBroadcast();
        MessageBoard board = new MessageBoard();
        console.log("MessageBoard deployed at:", address(board));
        vm.stopBroadcast();
    }
}
