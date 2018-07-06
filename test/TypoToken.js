// @flow
import EVMRevert from './helpers/EVMRevert';

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(web3.BigNumber))
    .should();

const TypoToken = artifacts.require('TypoToken.sol');

contract('TypoToken', function ([_, wallet1, wallet2, wallet3, wallet4, wallet5]) {
    let typoToken;

    beforeEach(async function () {
        typoToken = await TypoToken.new(3);
    });

    describe('fixAddress', async function () {
        it('should replace 1st byte properly', async function () {
            (await typoToken.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x00\x01"))
            ).should.be.equal("0x1234567812345678123456781234567812345601");

            (await typoToken.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x00\x55"))
            ).should.be.equal("0x1234567812345678123456781234567812345655");

            (await typoToken.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x00\xFF"))
            ).should.be.equal("0x12345678123456781234567812345678123456ff");
        });

        it('should replace 2nd byte properly', async function () {
            (await typoToken.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x01\x01"))
            ).should.be.equal("0x1234567812345678123456781234567812340178");

            (await typoToken.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x01\x55"))
            ).should.be.equal("0x1234567812345678123456781234567812345578");

            (await typoToken.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x01\xFF"))
            ).should.be.equal("0x123456781234567812345678123456781234ff78");
        });

        it('should replace 20th byte properly', async function () {
            (await typoToken.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x13\x01"))
            ).should.be.equal("0x0134567812345678123456781234567812345678");

            (await typoToken.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x13\x55"))
            ).should.be.equal("0x5534567812345678123456781234567812345678");

            (await typoToken.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x13\xFF"))
            ).should.be.equal("0xff34567812345678123456781234567812345678");
        });

        it('should failure on position out of range', async function () {
            await typoToken.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x14\x01")
            ).should.be.rejectedWith(EVMRevert);

            await typoToken.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x55\x01")
            ).should.be.rejectedWith(EVMRevert);

            await typoToken.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\xff\x01")
            ).should.be.rejectedWith(EVMRevert);
        });
    })
});
