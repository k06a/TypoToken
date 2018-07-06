// @flow
import EVMRevert from './helpers/EVMRevert';

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(web3.BigNumber))
    .should();

const TypoToken = artifacts.require('TypoToken.sol');

contract('TypoToken', function ([_, wallet1, wallet2, wallet3, wallet4, wallet5]) {

});
