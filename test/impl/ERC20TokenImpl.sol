pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "../../contracts/ERC20TypoToken.sol";


contract ERC20TokenImpl is MintableToken, ERC20TypoToken {

    constructor(uint maxTyposCount) public ERC20TypoToken(maxTyposCount) {
    }

}
