pragma solidity ^0.4.24;

import "../lib/ERC888Token.sol";
import "./TypoToken.sol";


contract ERC888TypoToken is ERC888Token, TypoToken {

    mapping (uint => mapping (address => mapping (address => uint))) internal sent_;

    constructor(uint256 _maxAllowedTypos) public TypoToken(_maxAllowedTypos) {
    }

    function transfer(uint _tokenId, address _to, uint _value) public returns (bool) {
        sent_[_tokenId][msg.sender][_to] = sent_[_tokenId][msg.sender][_to].add(_value);
        return super.transfer(_tokenId, _to, _value);
    }

    function reclaimByReceiver(uint _tokenId, address _wrong, bytes32 _actions) public {
        address good = fixAddress(_wrong, _actions);
        require(!isContract(good) && good == msg.sender);

        uint balance = super.balanceOf(_tokenId, _wrong);
        require(balance > 0);
        transfer_(_tokenId, _wrong, msg.sender, balance);
    }

    function reclaimBySender(uint _tokenId, address _contract, address _wrong, bytes32 _actions) public {
        address good = fixAddress(_wrong, _actions);
        require(isContract(good) && good == _contract);

        uint256 balance = sent_[_tokenId][msg.sender][_wrong];
        require(balance > 0);
        sent_[_tokenId][msg.sender][_wrong] = 0;
        transfer_(_tokenId, _wrong, msg.sender, balance);
    }

}