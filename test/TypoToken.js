// @flow
import EVMRevert from './helpers/EVMRevert';

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(web3.BigNumber))
    .should();

const Token = artifacts.require('Token');

contract('token', function ([_, wallet1, wallet2, wallet3, wallet4, wallet5]) {
    let token;

    beforeEach(async function () {
        token = await Token.new(3);
    });

    describe('fixAddress', async function () {
        it('should replace 1st char properly', async function () {
            (await token.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x00\x00"))
            ).should.be.equal("0x1234567812345678123456781234567812345670");

            (await token.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x00\x01"))
            ).should.be.equal("0x1234567812345678123456781234567812345671");

            (await token.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x00\x05"))
            ).should.be.equal("0x1234567812345678123456781234567812345675");

            (await token.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x00\x0F"))
            ).should.be.equal("0x123456781234567812345678123456781234567f");
        });

        it('should replace 2nd char properly', async function () {
            (await token.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x01\x00"))
            ).should.be.equal("0x1234567812345678123456781234567812345608");

            (await token.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x01\x01"))
            ).should.be.equal("0x1234567812345678123456781234567812345618");

            (await token.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x01\x05"))
            ).should.be.equal("0x1234567812345678123456781234567812345658");

            (await token.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x01\x0F"))
            ).should.be.equal("0x12345678123456781234567812345678123456f8");
        });

        it('should replace 40th char properly', async function () {
            (await token.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x27\x00"))
            ).should.be.equal("0x0234567812345678123456781234567812345678");

            (await token.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x27\x01"))
            ).should.be.equal("0x1234567812345678123456781234567812345678");

            (await token.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x27\x05"))
            ).should.be.equal("0x5234567812345678123456781234567812345678");

            (await token.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x27\x0F"))
            ).should.be.equal("0xf234567812345678123456781234567812345678");
        });

        it('should failure on position out of range [0,39]', async function () {
            await token.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x28\x01")
            ).should.be.rejectedWith(EVMRevert);

            await token.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x55\x01")
            ).should.be.rejectedWith(EVMRevert);

            await token.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\xff\x01")
            ).should.be.rejectedWith(EVMRevert);
        });

        it('should failure on value out of range [0,15]', async function () {
            await token.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x00\x10")
            ).should.be.rejectedWith(EVMRevert);

            await token.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x00\x50")
            ).should.be.rejectedWith(EVMRevert);

            await token.fixAddress.call(
                "0x1234567812345678123456781234567812345678",
                web3.fromAscii("\x01\x00\xf0")
            ).should.be.rejectedWith(EVMRevert);
        });
    });

    describe('reclaimByReceiver', async function () {
        beforeEach(async function () {
            await token.mint(wallet1, 1000);
        });

        it('should restore with 1 byte error', async function () {
            // await token.fixAddress.call(
            //     "0x1234567812345678123456781234567812345678",
            //     web3.fromAscii("\x01\x14\x01")
            // ).should.be.rejectedWith(EVMRevert);

            // await token.fixAddress.call(
            //     "0x1234567812345678123456781234567812345678",
            //     web3.fromAscii("\x01\x55\x01")
            // ).should.be.rejectedWith(EVMRevert);

            // await token.fixAddress.call(
            //     "0x1234567812345678123456781234567812345678",
            //     web3.fromAscii("\x01\xff\x01")
            // ).should.be.rejectedWith(EVMRevert);
        });
    });
});
