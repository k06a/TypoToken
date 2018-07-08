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
  mapping (uint => address) public tokenMinter;
  bool public mintingFinished = false;

  modifier canMint(uint _tokenId) {
    require(!mintingFinished && !tokenMintingFinished[_tokenId]);
    _;
  }

  modifier hasMintPermission(uint _tokenId) {
    require(msg.sender == owner || msg.sender == tokenMinter[_tokenId]);
    _;
  }

  function mint(
    uint _tokenId,
    address _to,
    uint256 _amount
  )
    hasMintPermission(_tokenId)
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

  function setTokenMinter(uint _tokenId, address _minter) public onlyOwner {
    tokenMinter[_tokenId] = _minter;
  }

  function finishMinting() onlyOwner public returns (bool) {
    require(!mintingFinished);
    mintingFinished = true;
    emit MintFinished();
    return true;
  }

  function finishMintingToken(uint _tokenId) onlyOwner canMint(_tokenId) public returns (bool) {
    tokenMintingFinished[_tokenId] = true;
    emit TokenMintFinished(_tokenId);
    return true;
  }
}