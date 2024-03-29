pragma solidity ^0.4.24;


contract TypoLib {

    uint256 public maxAllowedTypos_;
    
    constructor(uint256 _maxAllowedTypos) public {
        require(_maxAllowedTypos <= 5);
        maxAllowedTypos_ = _maxAllowedTypos;
    }

    function isContract(address addr) public view returns (bool) {
        uint size;
        assembly { size := extcodesize(addr) }
        return size > 0;
    }

    function fixAddress(address _wrong, bytes32 _actions) public view returns (address) {
        uint256 fullMask = uint256(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
        uint256 result = uint256(_wrong);

        for (uint i = 0; i < maxAllowedTypos_ * 3 && _actions[i] != 0; i += 3) {
            byte actionType = _actions[i];
            uint256 position = uint256(_actions[i + 1]);
            uint256 value = uint256(_actions[i + 2]);
            require(position < 40); // 40 hex symbols
            require(value < 16); // value should fit in 4 bits (1 hex char)

            uint mask;
            uint maskLow;
            uint maskHigh;
            if (actionType == 1) { // replace byte
                mask = fullMask ^ (0x0F << (position * 4));
                result = (result & mask) | (value << (position * 4));
            } else 
            if (actionType == 2) { // delete byte
                maskLow = (1 << (position * 4)) - 1;
                maskHigh = fullMask ^ (maskLow << 4) ^ 0x0f;
                result = ((result & maskHigh) >> 4) | (result & maskLow);
            } else 
            if (actionType == 3) { // insert byte
                maskLow = (1 << (position * 4)) - 1;
                maskHigh = fullMask ^ maskLow;
                result = ((result & maskHigh) << 4) | (value << (position * 4)) | (result & maskLow);
            } else {
                revert();
            }
        }

        address fixedAddress = address(result & fullMask);
        require(_wrong != fixedAddress);
        return address(fixedAddress);
    }

}
