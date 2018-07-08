// @flow
import EVMRevert from './helpers/EVMRevert';

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(web3.BigNumber))
    .should();

const Token = artifacts.require('ERC888TokenImpl');

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

contract('ERC888TypoToken', function ([_, wallet1, wallet2, wallet3, wallet4, wallet5]) {
    let token;

    beforeEach(async function () {
        token = await Token.new(3);
    });

    // describe('sent to wrong wallet address', async function () {
    //     beforeEach(async function () {
    //         await token.mint(wallet1, 1000);
    //     });

    //     it('should restore funds after 1 error', async function () {
    //         let wallet2wrong;
    //         let originalChar;

    //         originalChar = wallet2.charAt(41);
    //         wallet2wrong = wallet2.replaceAt(41, (originalChar == '0') ? '1' : '0');
    //         await token.transfer(wallet2wrong, 1, { from: wallet1 });
    //         await token.reclaimByReceiver(wallet2wrong, "\x01\x00" + web3.toAscii("0x0" + originalChar),  { from: wallet2 });
    //         (await token.balanceOf.call(wallet2wrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet2)).should.be.bignumber.equal(1);

    //         originalChar = wallet2.charAt(40);
    //         wallet2wrong = wallet2.replaceAt(40, (originalChar == '0') ? '1' : '0');
    //         await token.transfer(wallet2wrong, 1, { from: wallet1 });
    //         await token.reclaimByReceiver(wallet2wrong, "\x01\x01" + web3.toAscii("0x0" + originalChar),  { from: wallet2 });
    //         (await token.balanceOf.call(wallet2wrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet2)).should.be.bignumber.equal(2);

    //         originalChar = wallet2.charAt(3);
    //         wallet2wrong = wallet2.replaceAt(3, (originalChar == '0') ? '1' : '0');
    //         await token.transfer(wallet2wrong, 1, { from: wallet1 });
    //         await token.reclaimByReceiver(wallet2wrong, "\x01\x26" + web3.toAscii("0x0" + originalChar),  { from: wallet2 });
    //         (await token.balanceOf.call(wallet2wrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet2)).should.be.bignumber.equal(3);

    //         originalChar = wallet2.charAt(2);
    //         wallet2wrong = wallet2.replaceAt(2, (originalChar == '0') ? '1' : '0');
    //         await token.transfer(wallet2wrong, 1, { from: wallet1 });
    //         await token.reclaimByReceiver(wallet2wrong, "\x01\x27" + web3.toAscii("0x0" + originalChar),  { from: wallet2 });
    //         (await token.balanceOf.call(wallet2wrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet2)).should.be.bignumber.equal(4);
    //     });

    //     it('should restore funds after 2 errors', async function () {
    //         let wallet2wrong;
    //         let originalChar1;
    //         let originalChar2;

    //         originalChar1 = wallet2.charAt(40);
    //         originalChar2 = wallet2.charAt(41);
    //         wallet2wrong = wallet2.replaceAt(40, (originalChar1 == '0') ? '1' : '0')
    //                                 .replaceAt(41, (originalChar2 == '0') ? '1' : '0');
    //         await token.transfer(wallet2wrong, 1, { from: wallet1 });
    //         await token.reclaimByReceiver(
    //             wallet2wrong,
    //             "\x01\x01" + web3.toAscii("0x0" + originalChar1) +
    //             "\x01\x00" + web3.toAscii("0x0" + originalChar2),
    //             { from: wallet2 }
    //         );
    //         (await token.balanceOf.call(wallet2wrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet2)).should.be.bignumber.equal(1);

    //         originalChar1 = wallet2.charAt(39);
    //         originalChar2 = wallet2.charAt(40);
    //         wallet2wrong = wallet2.replaceAt(39, (originalChar1 == '0') ? '1' : '0')
    //                                 .replaceAt(40, (originalChar2 == '0') ? '1' : '0');
    //         await token.transfer(wallet2wrong, 1, { from: wallet1 });
    //         await token.reclaimByReceiver(
    //             wallet2wrong,
    //             "\x01\x02" + web3.toAscii("0x0" + originalChar1) +
    //             "\x01\x01" + web3.toAscii("0x0" + originalChar2),
    //             { from: wallet2 }
    //         );
    //         (await token.balanceOf.call(wallet2wrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet2)).should.be.bignumber.equal(2);

    //         originalChar1 = wallet2.charAt(2);
    //         originalChar2 = wallet2.charAt(3);
    //         wallet2wrong = wallet2.replaceAt(2, (originalChar1 == '0') ? '1' : '0')
    //                                 .replaceAt(3, (originalChar2 == '0') ? '1' : '0');
    //         await token.transfer(wallet2wrong, 1, { from: wallet1 });
    //         await token.reclaimByReceiver(
    //             wallet2wrong,
    //             "\x01\x27" + web3.toAscii("0x0" + originalChar1) +
    //             "\x01\x26" + web3.toAscii("0x0" + originalChar2),
    //             { from: wallet2 }
    //         );
    //         (await token.balanceOf.call(wallet2wrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet2)).should.be.bignumber.equal(3);

    //         originalChar1 = wallet2.charAt(40);
    //         originalChar2 = wallet2.charAt(3);
    //         wallet2wrong = wallet2.replaceAt(40, (originalChar1 == '0') ? '1' : '0')
    //                                 .replaceAt(3, (originalChar2 == '0') ? '1' : '0');
    //         await token.transfer(wallet2wrong, 1, { from: wallet1 });
    //         await token.reclaimByReceiver(
    //             wallet2wrong,
    //             "\x01\x01" + web3.toAscii("0x0" + originalChar1) +
    //             "\x01\x26" + web3.toAscii("0x0" + originalChar2),
    //             { from: wallet2 }
    //         );
    //         (await token.balanceOf.call(wallet2wrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet2)).should.be.bignumber.equal(4);
    //     });

    //     it('should restore funds after 3 errors', async function () {
    //         let wallet2wrong;
    //         let originalChar1;
    //         let originalChar2;
    //         let originalChar3;

    //         originalChar1 = wallet2.charAt(39);
    //         originalChar2 = wallet2.charAt(40);
    //         originalChar3 = wallet2.charAt(41);
    //         wallet2wrong = wallet2.replaceAt(39, (originalChar1 == '0') ? '1' : '0')
    //                                 .replaceAt(40, (originalChar2 == '0') ? '1' : '0')
    //                                 .replaceAt(41, (originalChar3 == '0') ? '1' : '0');
    //         await token.transfer(wallet2wrong, 1, { from: wallet1 });
    //         await token.reclaimByReceiver(
    //             wallet2wrong,
    //             "\x01\x02" + web3.toAscii("0x0" + originalChar1) +
    //             "\x01\x01" + web3.toAscii("0x0" + originalChar2) +
    //             "\x01\x00" + web3.toAscii("0x0" + originalChar3),
    //             { from: wallet2 }
    //         );
    //         (await token.balanceOf.call(wallet2wrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet2)).should.be.bignumber.equal(1);

    //         originalChar1 = wallet2.charAt(2);
    //         originalChar2 = wallet2.charAt(3);
    //         originalChar3 = wallet2.charAt(4);
    //         wallet2wrong = wallet2.replaceAt(2, (originalChar1 == '0') ? '1' : '0')
    //                                 .replaceAt(3, (originalChar2 == '0') ? '1' : '0')
    //                                 .replaceAt(4, (originalChar3 == '0') ? '1' : '0');
    //         await token.transfer(wallet2wrong, 1, { from: wallet1 });
    //         await token.reclaimByReceiver(
    //             wallet2wrong,
    //             "\x01\x27" + web3.toAscii("0x0" + originalChar1) +
    //             "\x01\x26" + web3.toAscii("0x0" + originalChar2) +
    //             "\x01\x25" + web3.toAscii("0x0" + originalChar3),
    //             { from: wallet2 }
    //         );
    //         (await token.balanceOf.call(wallet2wrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet2)).should.be.bignumber.equal(2);

    //         originalChar1 = wallet2.charAt(2);
    //         originalChar2 = wallet2.charAt(10);
    //         originalChar3 = wallet2.charAt(41);
    //         wallet2wrong = wallet2.replaceAt(2, (originalChar1 == '0') ? '1' : '0')
    //                                 .replaceAt(10, (originalChar2 == '0') ? '1' : '0')
    //                                 .replaceAt(41, (originalChar3 == '0') ? '1' : '0');
    //         await token.transfer(wallet2wrong, 1, { from: wallet1 });
    //         await token.reclaimByReceiver(
    //             wallet2wrong,
    //             "\x01\x27" + web3.toAscii("0x0" + originalChar1) +
    //             "\x01\x1f" + web3.toAscii("0x0" + originalChar2) +
    //             "\x01\x00" + web3.toAscii("0x0" + originalChar3),
    //             { from: wallet2 }
    //         );
    //         (await token.balanceOf.call(wallet2wrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet2)).should.be.bignumber.equal(3);
    //     });

    //     it('should failure to recover funds twice after 1 error', async function () {
    //         let wallet2wrong;
    //         let originalChar;

    //         originalChar = wallet2.charAt(41);
    //         wallet2wrong = wallet2.replaceAt(41, (originalChar == '0') ? '1' : '0');
    //         await token.transfer(wallet2wrong, 1, { from: wallet1 });
    //         await token.reclaimByReceiver(wallet2wrong, "\x01\x00" + web3.toAscii("0x0" + originalChar),  { from: wallet2 });
    //         (await token.balanceOf.call(wallet2wrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet2)).should.be.bignumber.equal(1);

    //         await token.reclaimByReceiver(wallet2wrong, "\x01\x00" + web3.toAscii("0x0" + originalChar),  { from: wallet2 }).should.be.rejectedWith(EVMRevert);
    //         (await token.balanceOf.call(wallet2wrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet2)).should.be.bignumber.equal(1);
    //     });

    //     it('should failure to recover funds after 4 errors', async function () {
    //         let wallet2wrong;
    //         let originalChar1;
    //         let originalChar2;
    //         let originalChar3;
    //         let originalChar4;

    //         originalChar1 = wallet2.charAt(38);
    //         originalChar2 = wallet2.charAt(39);
    //         originalChar3 = wallet2.charAt(40);
    //         originalChar3 = wallet2.charAt(41);
    //         wallet2wrong = wallet2.replaceAt(38, (originalChar1 == '0') ? '1' : '0')
    //                                 .replaceAt(39, (originalChar2 == '0') ? '1' : '0')
    //                                 .replaceAt(40, (originalChar3 == '0') ? '1' : '0')
    //                                 .replaceAt(41, (originalChar4 == '0') ? '1' : '0');
    //         await token.transfer(wallet2wrong, 1, { from: wallet1 });
    //         await token.reclaimByReceiver(
    //             wallet2wrong,
    //             "\x01\x03" + web3.toAscii("0x0" + originalChar1) +
    //             "\x01\x02" + web3.toAscii("0x0" + originalChar1) +
    //             "\x01\x01" + web3.toAscii("0x0" + originalChar2) +
    //             "\x01\x00" + web3.toAscii("0x0" + originalChar3),
    //             { from: wallet2 }
    //         ).should.be.rejectedWith(EVMRevert);
    //         (await token.balanceOf.call(wallet2wrong)).should.be.bignumber.equal(1);
    //         (await token.balanceOf.call(wallet2)).should.be.bignumber.equal(0);
    //     });
    // });

    // describe('sent to wrong smart contract address', async function () {
    //     let contract;

    //     beforeEach(async function () {
    //         await token.mint(wallet1, 1000);
    //         contract = await Token.new(0);
    //     })

    //     it('should restore funds after 1 error', async function () {
    //         let contractWrong;
    //         let originalChar;

    //         originalChar = contract.address.charAt(41);
    //         contractWrong = contract.address.replaceAt(41, (originalChar == '0') ? '1' : '0');
    //         await token.transfer(contractWrong, 1, { from: wallet1 });
    //         await token.reclaimBySender(contract.address, contractWrong, "\x01\x00" + web3.toAscii("0x0" + originalChar),  { from: wallet1 });
    //         (await token.balanceOf.call(contractWrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet1)).should.be.bignumber.equal(1000);

    //         originalChar = contract.address.charAt(40);
    //         contractWrong = contract.address.replaceAt(40, (originalChar == '0') ? '1' : '0');
    //         await token.transfer(contractWrong, 1, { from: wallet1 });
    //         await token.reclaimBySender(contract.address, contractWrong, "\x01\x01" + web3.toAscii("0x0" + originalChar),  { from: wallet1 });
    //         (await token.balanceOf.call(contractWrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet1)).should.be.bignumber.equal(1000);

    //         originalChar = contract.address.charAt(3);
    //         contractWrong = contract.address.replaceAt(3, (originalChar == '0') ? '1' : '0');
    //         await token.transfer(contractWrong, 1, { from: wallet1 });
    //         await token.reclaimBySender(contract.address, contractWrong, "\x01\x26" + web3.toAscii("0x0" + originalChar),  { from: wallet1 });
    //         (await token.balanceOf.call(contractWrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet1)).should.be.bignumber.equal(1000);

    //         originalChar = contract.address.charAt(2);
    //         contractWrong = contract.address.replaceAt(2, (originalChar == '0') ? '1' : '0');
    //         await token.transfer(contractWrong, 1, { from: wallet1 });
    //         await token.reclaimBySender(contract.address, contractWrong, "\x01\x27" + web3.toAscii("0x0" + originalChar),  { from: wallet1 });
    //         (await token.balanceOf.call(contractWrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet1)).should.be.bignumber.equal(1000);
    //     });

    //     it('should restore funds after 2 errors', async function () {
    //         let contractWrong;
    //         let originalChar1;
    //         let originalChar2;

    //         originalChar1 = contract.address.charAt(40);
    //         originalChar2 = contract.address.charAt(41);
    //         contractWrong = contract.address.replaceAt(40, (originalChar1 == '0') ? '1' : '0')
    //                                         .replaceAt(41, (originalChar2 == '0') ? '1' : '0');
    //         await token.transfer(contractWrong, 1, { from: wallet1 });
    //         await token.reclaimBySender(
    //             contract.address,
    //             contractWrong,
    //             "\x01\x01" + web3.toAscii("0x0" + originalChar1) +
    //             "\x01\x00" + web3.toAscii("0x0" + originalChar2),
    //             { from: wallet1 }
    //         );
    //         (await token.balanceOf.call(contractWrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet1)).should.be.bignumber.equal(1000);

    //         originalChar1 = contract.address.charAt(39);
    //         originalChar2 = contract.address.charAt(40);
    //         contractWrong = contract.address.replaceAt(39, (originalChar1 == '0') ? '1' : '0')
    //                                         .replaceAt(40, (originalChar2 == '0') ? '1' : '0');
    //         await token.transfer(contractWrong, 1, { from: wallet1 });
    //         await token.reclaimBySender(
    //             contract.address,
    //             contractWrong,
    //             "\x01\x02" + web3.toAscii("0x0" + originalChar1) +
    //             "\x01\x01" + web3.toAscii("0x0" + originalChar2),
    //             { from: wallet1 }
    //         );
    //         (await token.balanceOf.call(contractWrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet1)).should.be.bignumber.equal(1000);

    //         originalChar1 = contract.address.charAt(2);
    //         originalChar2 = contract.address.charAt(3);
    //         contractWrong = contract.address.replaceAt(2, (originalChar1 == '0') ? '1' : '0')
    //                                         .replaceAt(3, (originalChar2 == '0') ? '1' : '0');
    //         await token.transfer(contractWrong, 1, { from: wallet1 });
    //         await token.reclaimBySender(
    //             contract.address,
    //             contractWrong,
    //             "\x01\x27" + web3.toAscii("0x0" + originalChar1) +
    //             "\x01\x26" + web3.toAscii("0x0" + originalChar2),
    //             { from: wallet1 }
    //         );
    //         (await token.balanceOf.call(contractWrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet1)).should.be.bignumber.equal(1000);

    //         originalChar1 = contract.address.charAt(40);
    //         originalChar2 = contract.address.charAt(3);
    //         contractWrong = contract.address.replaceAt(40, (originalChar1 == '0') ? '1' : '0')
    //                                         .replaceAt(3, (originalChar2 == '0') ? '1' : '0');
    //         await token.transfer(contractWrong, 1, { from: wallet1 });
    //         await token.reclaimBySender(
    //             contract.address,
    //             contractWrong,
    //             "\x01\x01" + web3.toAscii("0x0" + originalChar1) +
    //             "\x01\x26" + web3.toAscii("0x0" + originalChar2),
    //             { from: wallet1 }
    //         );
    //         (await token.balanceOf.call(contractWrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet1)).should.be.bignumber.equal(1000);
    //     });

    //     it('should restore funds after 3 errors', async function () {
    //         let contractWrong;
    //         let originalChar1;
    //         let originalChar2;
    //         let originalChar3;

    //         originalChar1 = contract.address.charAt(39);
    //         originalChar2 = contract.address.charAt(40);
    //         originalChar3 = contract.address.charAt(41);
    //         contractWrong = contract.address.replaceAt(39, (originalChar1 == '0') ? '1' : '0')
    //                                         .replaceAt(40, (originalChar2 == '0') ? '1' : '0')
    //                                         .replaceAt(41, (originalChar3 == '0') ? '1' : '0');
    //         await token.transfer(contractWrong, 1, { from: wallet1 });
    //         await token.reclaimBySender(
    //             contract.address,
    //             contractWrong,
    //             "\x01\x02" + web3.toAscii("0x0" + originalChar1) +
    //             "\x01\x01" + web3.toAscii("0x0" + originalChar2) +
    //             "\x01\x00" + web3.toAscii("0x0" + originalChar3),
    //             { from: wallet1 }
    //         );
    //         (await token.balanceOf.call(contractWrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet1)).should.be.bignumber.equal(1000);

    //         originalChar1 = contract.address.charAt(2);
    //         originalChar2 = contract.address.charAt(3);
    //         originalChar3 = contract.address.charAt(4);
    //         contractWrong = contract.address.replaceAt(2, (originalChar1 == '0') ? '1' : '0')
    //                                         .replaceAt(3, (originalChar2 == '0') ? '1' : '0')
    //                                         .replaceAt(4, (originalChar3 == '0') ? '1' : '0');
    //         await token.transfer(contractWrong, 1, { from: wallet1 });
    //         await token.reclaimBySender(
    //             contract.address,
    //             contractWrong,
    //             "\x01\x27" + web3.toAscii("0x0" + originalChar1) +
    //             "\x01\x26" + web3.toAscii("0x0" + originalChar2) +
    //             "\x01\x25" + web3.toAscii("0x0" + originalChar3),
    //             { from: wallet1 }
    //         );
    //         (await token.balanceOf.call(contractWrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet1)).should.be.bignumber.equal(1000);

    //         originalChar1 = contract.address.charAt(2);
    //         originalChar2 = contract.address.charAt(10);
    //         originalChar3 = contract.address.charAt(41);
    //         contractWrong = contract.address.replaceAt(2, (originalChar1 == '0') ? '1' : '0')
    //                                         .replaceAt(10, (originalChar2 == '0') ? '1' : '0')
    //                                         .replaceAt(41, (originalChar3 == '0') ? '1' : '0');
    //         await token.transfer(contractWrong, 1, { from: wallet1 });
    //         await token.reclaimBySender(
    //             contract.address,
    //             contractWrong,
    //             "\x01\x27" + web3.toAscii("0x0" + originalChar1) +
    //             "\x01\x1f" + web3.toAscii("0x0" + originalChar2) +
    //             "\x01\x00" + web3.toAscii("0x0" + originalChar3),
    //             { from: wallet1 }
    //         );
    //         (await token.balanceOf.call(contractWrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet1)).should.be.bignumber.equal(1000);
    //     });

    //     it('should failure to restore funds twice after 1 error', async function () {
    //         let contractWrong;
    //         let originalChar;

    //         originalChar = contract.address.charAt(41);
    //         contractWrong = contract.address.replaceAt(41, (originalChar == '0') ? '1' : '0');
    //         await token.transfer(contractWrong, 1, { from: wallet1 });
    //         await token.reclaimBySender(contract.address, contractWrong, "\x01\x00" + web3.toAscii("0x0" + originalChar),  { from: wallet1 });
    //         (await token.balanceOf.call(contractWrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet1)).should.be.bignumber.equal(1000);

    //         await token.reclaimBySender(contract.address, contractWrong, "\x01\x00" + web3.toAscii("0x0" + originalChar),  { from: wallet1 }).should.be.rejectedWith(EVMRevert);
    //         (await token.balanceOf.call(contractWrong)).should.be.bignumber.equal(0);
    //         (await token.balanceOf.call(wallet1)).should.be.bignumber.equal(1000);
    //     });

    //     it('should failure to recover funds after 4 errors', async function () {
    //         let contractWrong;
    //         let originalChar1;
    //         let originalChar2;
    //         let originalChar3;
    //         let originalChar4;

    //         originalChar1 = contract.address.charAt(38);
    //         originalChar2 = contract.address.charAt(39);
    //         originalChar3 = contract.address.charAt(40);
    //         originalChar3 = contract.address.charAt(41);
    //         contractWrong = contract.address.replaceAt(38, (originalChar1 == '0') ? '1' : '0')
    //                                         .replaceAt(39, (originalChar2 == '0') ? '1' : '0')
    //                                         .replaceAt(40, (originalChar3 == '0') ? '1' : '0')
    //                                         .replaceAt(41, (originalChar4 == '0') ? '1' : '0');
    //         await token.transfer(contractWrong, 1, { from: wallet1 });
    //         await token.reclaimBySender(
    //             contract.address,
    //             contractWrong,
    //             "\x01\x03" + web3.toAscii("0x0" + originalChar1) +
    //             "\x01\x02" + web3.toAscii("0x0" + originalChar1) +
    //             "\x01\x01" + web3.toAscii("0x0" + originalChar2) +
    //             "\x01\x00" + web3.toAscii("0x0" + originalChar3),
    //             { from: wallet1 }
    //         ).should.be.rejectedWith(EVMRevert);
    //         (await token.balanceOf.call(contractWrong)).should.be.bignumber.equal(1);
    //         (await token.balanceOf.call(wallet1)).should.be.bignumber.equal(999);
    //     });
    // });
});
