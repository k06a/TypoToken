pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "../../contracts/TypoToken.sol";


contract Token is TypoToken, MintableToken {

    constructor(uint maxTyposCount) public TypoToken(maxTyposCount) {
    }

}
