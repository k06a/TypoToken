const TypoLib = artifacts.require('TypoLib');
const ERC20TypoToken = artifacts.require('ERC20TypoToken');
const ERC888TypoToken = artifacts.require('ERC888TypoToken');

module.exports = function (deployer) {
    deployer.deploy(TypoLib, 3);
    deployer.deploy(ERC20TypoToken, 3);
    deployer.deploy(ERC888TypoToken, 3);
};
