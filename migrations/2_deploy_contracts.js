const TypoToken = artifacts.require('TypoToken');

module.exports = function (deployer) {
    deployer.deploy(TypoToken);
};
