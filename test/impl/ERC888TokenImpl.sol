pragma solidity ^0.4.24;

import "../../lib/ERC888MintableToken.sol";
import "../../contracts/ERC888TypoToken.sol";


contract ERC888TokenImpl is ERC888MintableToken, ERC888TypoToken {

    constructor(uint maxTyposCount) public ERC888TypoToken(maxTyposCount) {
    }

}
