pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "./TypoLib.sol";


contract ERC20TypoToken is StandardToken, TypoLib {

    mapping (address => mapping (address => uint256)) internal sent_;

    constructor(uint256 _maxAllowedTypos) public TypoLib(_maxAllowedTypos) {
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        sent_[msg.sender][_to] = sent_[msg.sender][_to].add(_value);
        return super.transfer(_to, _value);
    }

    function reclaimByReceiver(address _wrong, bytes32 _actions) public {
        address good = fixAddress(_wrong, _actions);
        require(!isContract(good) && good == msg.sender);

        uint256 balance = balances[_wrong];
        require(balance > 0);
        balances[_wrong] = 0;
        balances[msg.sender] = balances[msg.sender].add(balance);
        emit Transfer(_wrong, msg.sender, balance);
    }

    function reclaimBySender(address _contract, address _wrong, bytes32 _actions) public {
        address good = fixAddress(_wrong, _actions);
        require(isContract(good) && good == _contract);

        uint256 balance = sent_[msg.sender][_wrong];
        require(balance > 0);
        sent_[msg.sender][_wrong] = 0;
        balances[_wrong] = balances[_wrong].sub(balance);
        balances[msg.sender] = balances[msg.sender].add(balance);
        emit Transfer(_wrong, msg.sender, balance);
    }
    
}