pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";


contract TypoToken is StandardToken {

    uint256 public maxAllowedTypos;
    mapping (address => bool) internal addressWasUsed;
    mapping (address => mapping (address => uint256)) internal sent;
    
    constructor(uint256 _maxAllowedTypos) public {
        require(_maxAllowedTypos <= 5);
        maxAllowedTypos = _maxAllowedTypos;
    }

    function isContract(address addr) public view returns (bool) {
        uint size;
        assembly { size := extcodesize(addr) }
        return size > 0;
    }

    function fixAddress(address _wrong, bytes32 _actions) public view returns (address) {
        uint256 fullMask = uint256(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
        uint256 result = uint256(_wrong);

        for (uint i = 0; i < maxAllowedTypos * 3 && _actions[i] != 0; i += 3) {
            byte actionType = _actions[i];
            uint256 position = uint256(_actions[i + 1]);
            uint256 value = uint256(_actions[i + 2]);
            require(position < 40); // 40 hex symbols
            require(value < 16); // value should fit in 4 bits (1 hex char)

            if (actionType == 1) { // replace byte
                uint mask = fullMask ^ (0x0F << (position * 4));
                result = (result & mask) | (value << (position * 4));
            }
        }

        return address(result);
    }

    function reclaimByReceiver(address _wrong, bytes32 _actions) public {
        require(msg.sender == fixAddress(_wrong, _actions));
        uint256 balance = balances[_wrong];
        require(balance > 0);
        balances[_wrong] = 0;
        balances[msg.sender] = balances[msg.sender].add(balance);
        emit Transfer(_wrong, msg.sender, balance);
    }

    function reclaimBySender(address _contract, address _wrong, bytes32 _actions) public {
        require(isContract(_contract) && _contract == fixAddress(_wrong, _actions));
        uint256 balance = sent[msg.sender][_wrong];
        require(balance > 0);
        sent[msg.sender][_wrong] = 0;
        balances[_wrong] = balances[_wrong].sub(balance);
        balances[msg.sender] = balances[msg.sender].add(balance);
        emit Transfer(_wrong, msg.sender, balance);
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        if (!addressWasUsed[msg.sender]) {
            addressWasUsed[msg.sender] = true;
        }
        bool destinationExist = isContract(_to) || addressWasUsed[_to];
        if (!destinationExist) {
            sent[msg.sender][_to] = sent[msg.sender][_to].add(_value);
        }
        return super.transfer(_to, _value);
    }

}
