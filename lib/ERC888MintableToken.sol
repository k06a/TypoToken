pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./ERC888Token.sol";


contract ERC888MintableToken is Ownable, ERC888Token {
  using SafeMath for uint;

  event Mint(uint indexed tokenId, address indexed to, uint256 amount);
  event TokenMintFinished(uint indexed tokenId);
  event MintFinished();

  mapping (uint => bool) public tokenMintingFinished;
  bool public mintingFinished = false;

  modifier canMint(uint _tokenId) {
    require(!mintingFinished);
    if (totalSupply_[_tokenId] > 0) {
      require(!tokenMintingFinished[_tokenId]);
    }
    _;
  }

  modifier hasMintPermission() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Function to mint tokens
   * @param _to The address that will receive the minted tokens.
   * @param _amount The amount of tokens to mint.
   * @return A boolean that indicates if the operation was successful.
   */
  function mint(
    uint _tokenId,
    address _to,
    uint256 _amount
  )
    hasMintPermission
    canMint(_tokenId)
    public
    returns (bool)
  {
    totalSupply_[_tokenId] = totalSupply_[_tokenId].add(_amount);
    balances[_tokenId][_to] = balances[_tokenId][_to].add(_amount);
    emit Mint(_tokenId, _to, _amount);
    emit Transfer(_tokenId, address(0), _to, _amount);
    return true;
  }

  /**
   * @dev Function to stop minting new tokens.
   * @return True if the operation was successful.
   */
  function finishMinting() onlyOwner public returns (bool) {
    require(!mintingFinished);
    mintingFinished = true;
    emit MintFinished();
    return true;
  }

  /**
   * @dev Function to stop minting new tokens.
   * @return True if the operation was successful.
   */
  function finishMintingToken(uint _tokenId) onlyOwner canMint(_tokenId) public returns (bool) {
    tokenMintingFinished[_tokenId] = true;
    emit TokenMintFinished(_tokenId);
    return true;
  }
}