// @flow
import EVMRevert from './helpers/EVMRevert';

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(web3.BigNumber))
    .should();

const TypoLib = artifacts.require('TypoLib');

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

contract('TypoLib', function ([_, wallet1, wallet2, wallet3, wallet4, wallet5]) {
    let lib;

    beforeEach(async function () {
        lib = await TypoLib.new(3);
    });

    it('should fail to create ERC20TypoToken with more than 5 typos', async function () {
        await TypoLib.new(1).should.be.fulfilled;
        await TypoLib.new(2).should.be.fulfilled;
        await TypoLib.new(3).should.be.fulfilled;
        await TypoLib.new(4).should.be.fulfilled;
        await TypoLib.new(5).should.be.fulfilled;
        await TypoLib.new(6).should.be.rejectedWith(EVMRevert);
        await TypoLib.new(7).should.be.rejectedWith(EVMRevert);
        await TypoLib.new(100).should.be.rejectedWith(EVMRevert);
    });

    describe('fixAddress', async function () {
        describe('replace character operation', async function () {
            it('should works for 1st', async function () {
                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //                                        ^
                    web3.fromAscii("\x01\x00\x00"))
                ).should.be.equal("0x1234567812345678123456781234567812345670");

                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //                                        ^
                    web3.fromAscii("\x01\x00\x01"))
                ).should.be.equal("0x1234567812345678123456781234567812345671");

                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //                                        ^
                    web3.fromAscii("\x01\x00\x05"))
                ).should.be.equal("0x1234567812345678123456781234567812345675");

                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //                                        ^
                    web3.fromAscii("\x01\x00\x0F"))
                ).should.be.equal("0x123456781234567812345678123456781234567f");
            });

            it('should works for 2nd', async function () {
                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //                                       ^
                    web3.fromAscii("\x01\x01\x00"))
                ).should.be.equal("0x1234567812345678123456781234567812345608");

                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //                                       ^
                    web3.fromAscii("\x01\x01\x01"))
                ).should.be.equal("0x1234567812345678123456781234567812345618");

                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //                                       ^
                    web3.fromAscii("\x01\x01\x05"))
                ).should.be.equal("0x1234567812345678123456781234567812345658");

                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //                                       ^
                    web3.fromAscii("\x01\x01\x0F"))
                ).should.be.equal("0x12345678123456781234567812345678123456f8");
            });

            it('should works for 40th', async function () {
                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    // ^
                    web3.fromAscii("\x01\x27\x00"))
                ).should.be.equal("0x0234567812345678123456781234567812345678");

                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    // ^
                    web3.fromAscii("\x01\x27\x02"))
                ).should.be.equal("0x2234567812345678123456781234567812345678");

                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    // ^
                    web3.fromAscii("\x01\x27\x05"))
                ).should.be.equal("0x5234567812345678123456781234567812345678");

                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    // ^
                    web3.fromAscii("\x01\x27\x0F"))
                ).should.be.equal("0xf234567812345678123456781234567812345678");
            });
        });

        describe('delete character operation', async function () {
            it('should works for 1st', async function () {
                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //                                        ^
                    web3.fromAscii("\x02\x00\x00"))
                ).should.be.equal("0x0123456781234567812345678123456781234567");

                (await lib.fixAddress.call(
                    "0x123456781234567812345678123456781234567f",
                    //                                        ^
                    web3.fromAscii("\x02\x00\x00"))
                ).should.be.equal("0x0123456781234567812345678123456781234567");
            });

            it('should works for 2nd', async function () {
                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //                                       ^
                    web3.fromAscii("\x02\x01\x00"))
                ).should.be.equal("0x0123456781234567812345678123456781234568");

                (await lib.fixAddress.call(
                    "0x12345678123456781234567812345678123456f8",
                    //                                       ^
                    web3.fromAscii("\x02\x01\x00"))
                ).should.be.equal("0x0123456781234567812345678123456781234568");
            });

            it('should works for 39th', async function () {
                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //  ^
                    web3.fromAscii("\x02\x26\x00"))
                ).should.be.equal("0x0134567812345678123456781234567812345678");

                (await lib.fixAddress.call(
                    "0x1f34567812345678123456781234567812345678",
                    //  ^
                    web3.fromAscii("\x02\x26\x00"))
                ).should.be.equal("0x0134567812345678123456781234567812345678");
            });

            it('should works for 40th', async function () {
                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    // ^
                    web3.fromAscii("\x02\x27\x00"))
                ).should.be.equal("0x0234567812345678123456781234567812345678");

                (await lib.fixAddress.call(
                    "0xf234567812345678123456781234567812345678",
                    // ^
                    web3.fromAscii("\x02\x27\x00"))
                ).should.be.equal("0x0234567812345678123456781234567812345678");
            });

            it('should works for 2nd and 39th', async function () {
                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //  ^                                    ^
                    web3.fromAscii("\x02\x26\x00\x02\x01\x00"))
                ).should.be.equal("0x0013456781234567812345678123456781234568");

                (await lib.fixAddress.call(
                    "0x1f345678123456781234567812345678123456f8",
                    //  ^                                    ^
                    web3.fromAscii("\x02\x26\x00\x02\x01\x00"))
                ).should.be.equal("0x0013456781234567812345678123456781234568");
            });
        });

        describe('insert character operation', async function () {
            it('should works for 1st', async function () {
                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //                                        ^
                    web3.fromAscii("\x03\x00\x05"))
                ).should.be.equal("0x2345678123456781234567812345678123456785");
            });

            it('should works for 2nd', async function () {
                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //                                       ^
                    web3.fromAscii("\x03\x01\x05"))
                ).should.be.equal("0x2345678123456781234567812345678123456758");
            });

            it('should works for 39th', async function () {
                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //  ^
                    web3.fromAscii("\x03\x26\x05"))
                ).should.be.equal("0x2534567812345678123456781234567812345678");
            });

            it('should works for 40th', async function () {
                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    // ^
                    web3.fromAscii("\x03\x27\x05"))
                ).should.be.equal("0x5234567812345678123456781234567812345678");
            });

            it('should works for 2nd and 39th', async function () {
                (await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //  ^                                    ^
                    web3.fromAscii("\x03\x26\x05\x03\x01\x05"))
                ).should.be.equal("0x5345678123456781234567812345678123456758");
            });
        });

        describe('error handling', async function () {
            it('should failure on position out of range [0,39]', async function () {
                await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    web3.fromAscii("\x01\x28\x01")
                ).should.be.rejectedWith(EVMRevert);

                await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    web3.fromAscii("\x01\x55\x01")
                ).should.be.rejectedWith(EVMRevert);

                await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    web3.fromAscii("\x01\xff\x01")
                ).should.be.rejectedWith(EVMRevert);
            });

            it('should failure on value out of range [0,15]', async function () {
                await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    web3.fromAscii("\x01\x00\x10")
                ).should.be.rejectedWith(EVMRevert);

                await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    web3.fromAscii("\x01\x00\x50")
                ).should.be.rejectedWith(EVMRevert);

                await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    web3.fromAscii("\x01\x00\xf0")
                ).should.be.rejectedWith(EVMRevert);
            });

            it('should failure on type out of range [1,3]', async function () {
                await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    web3.fromAscii("\x01\x00\x01")
                ).should.be.fulfilled;

                await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    web3.fromAscii("\x02\x00\x01")
                ).should.be.fulfilled;

                await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    web3.fromAscii("\x03\x00\x01")
                ).should.be.fulfilled;

                //

                await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    web3.fromAscii("\x04\x00\x01")
                ).should.be.rejectedWith(EVMRevert);

                await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    web3.fromAscii("\x55\x00\x01")
                ).should.be.rejectedWith(EVMRevert);

                await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    web3.fromAscii("\xff\x00\x01")
                ).should.be.rejectedWith(EVMRevert);
            });

            it('should failure in case of 0 typos', async function () {
                await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    web3.fromAscii("\x00\x00\x00")
                ).should.be.rejectedWith(EVMRevert);

                await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    // ^
                    web3.fromAscii("\x01\x27\x01")
                ).should.be.rejectedWith(EVMRevert);

                await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //  ^
                    web3.fromAscii("\x01\x26\x02")
                ).should.be.rejectedWith(EVMRevert);

                await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //                                       ^
                    web3.fromAscii("\x01\x01\x07")
                ).should.be.rejectedWith(EVMRevert);

                await lib.fixAddress.call(
                    "0x1234567812345678123456781234567812345678",
                    //                                        ^
                    web3.fromAscii("\x01\x00\x08")
                ).should.be.rejectedWith(EVMRevert);
            });
        });
    });
});