# TypoToken

ERC20 token extension allowing recovery it after transfering to wrong address

# Installation

1. Install [truffle](http://truffleframework.com) globally with `npm install -g truffle`
2. Install [ganache-cli](https://github.com/trufflesuite/ganache-cli) globally with `npm install -g ganache-cli`
3. Install local packages with `npm install`
4. Run ganache in separate terminal `scripts/rpc.sh`
5. Run tests with `npm test`

On macOS you also need to install watchman: `brew install watchman`

# How it works

1. Anyone whose destination address contains mistakes can reclaim lost funds
2. Anyone who send tokens to wrong **smart contract address** can reclaim lost funds

# Usage

Just inherit your token from `TypoToken` and pass argument of possible typos in destination address:

```
contract MyToken is StandardToken, TypoToken(3) {
    ...
}
```

Or:

```
contract MyToken is StandardToken, TypoToken {
    ...
    constructor() public TypoToken(3) {
        ...
    }
    ...
}
```

Or:

```
contract MyToken is StandardToken, TypoToken {
    ...
    constructor(uint _maxAllowedTypos) public TypoToken(_maxAllowedTypos) {
        ...
    }
    ...
}
```
