/**
 * @module eth1
 */

import {ethers} from "ethers";
import {DEPOSIT_CONTRACT_ADDRESS} from "../../../eth2-types/src/constants";

export default {
  provider: ethers.getDefaultProvider(),
  depositContract: {
    //block at which contract is deployed
    deployedAt: 0,
    address: DEPOSIT_CONTRACT_ADDRESS,
    // eslint-disable-next-line max-len
    // taken from https://github.com/ethereum/deposit_contract/blob/master/deposit_contract/contracts/validator_registration.json
    // eslint-disable-next-line max-len
    abi: [{"name": "Deposit", "inputs": [{"type": "bytes", "name": "pubkey", "indexed": false}, {"type": "bytes", "name": "withdrawal_credentials", "indexed": false}, {"type": "bytes", "name": "amount", "indexed": false}, {"type": "bytes", "name": "signature", "indexed": false}, {"type": "bytes", "name": "merkle_tree_index", "indexed": false}], "anonymous": false, "type": "event"}, {"name": "Eth2Genesis", "inputs": [{"type": "bytes32", "name": "deposit_root", "indexed": false}, {"type": "bytes", "name": "deposit_count", "indexed": false}, {"type": "bytes", "name": "time", "indexed": false}], "anonymous": false, "type": "event"}, {"outputs": [], "inputs": [], "constant": false, "payable": false, "type": "constructor"}, {"name": "to_little_endian_64", "outputs": [{"type": "bytes", "name": "out"}], "inputs": [{"type": "uint256", "name": "value"}], "constant": true, "payable": false, "type": "function", "gas": 7077}, {"name": "from_little_endian_64", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "bytes", "name": "value"}], "constant": true, "payable": false, "type": "function", "gas": 5983}, {"name": "get_deposit_root", "outputs": [{"type": "bytes32", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 79251}, {"name": "get_deposit_count", "outputs": [{"type": "bytes", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 11056}, {"name": "deposit", "outputs": [], "inputs": [{"type": "bytes", "name": "pubkey"}, {"type": "bytes", "name": "withdrawal_credentials"}, {"type": "bytes", "name": "signature"}], "constant": false, "payable": true, "type": "function", "gas": 456517}, {"name": "chainStarted", "outputs": [{"type": "bool", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 633}],
    // eslint-disable-next-line max-len
    bytecode: "0x600035601c52740100000000000000000000000000000000000000006020526f7fffffffffffffffffffffffffffffff6040527fffffffffffffffffffffffffffffffff8000000000000000000000000000000060605274012a05f1fffffffffffffffffffffffffdabf41c006080527ffffffffffffffffffffffffed5fa0e000000000000000000000000000000000060a052341561009e57600080fd5b6101406000601f818352015b600061014051602081106100bd57600080fd5b600060c052602060c020015460208261016001015260208101905061014051602081106100e957600080fd5b600060c052602060c020015460208261016001015260208101905080610160526101609050805160208201209050606051600161014051018060405190131561013157600080fd5b809190121561013f57600080fd5b6020811061014c57600080fd5b600060c052602060c0200155606051600161014051018060405190131561017257600080fd5b809190121561018057600080fd5b6020811061018d57600080fd5b600060c052602060c020015460605160016101405101806040519013156101b357600080fd5b80919012156101c157600080fd5b602081106101ce57600080fd5b600160c052602060c02001555b81516001018083528114156100aa575b5050610f2c56600035601c52740100000000000000000000000000000000000000006020526f7fffffffffffffffffffffffffffffff6040527fffffffffffffffffffffffffffffffff8000000000000000000000000000000060605274012a05f1fffffffffffffffffffffffffdabf41c006080527ffffffffffffffffffffffffed5fa0e000000000000000000000000000000000060a0526380673289600051141561026b57602060046101403734156100b457600080fd5b67ffffffffffffffff6101405111156100cc57600080fd5b60006101605261014051610180526101a060006008818352015b6101605160086000811215610103578060000360020a820461010a565b8060020a82025b905090506101605260ff61018051166101c052610160516101c0516101605101101561013557600080fd5b6101c051610160510161016052610180517ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8600081121561017e578060000360020a8204610185565b8060020a82025b90509050610180525b81516001018083528114156100e6575b5050601860086020820661026001602082840111156101bc57600080fd5b60208061028082610160600060046015f1505081815280905090509050805160200180610320828460006004600a8704601201f16101f957600080fd5b50506103205160206001820306601f8201039050610380610320516008818352015b8261038051111561022b57610247565b60006103805161034001535b815160010180835281141561021b575b5050506020610300526040610320510160206001820306601f8201039050610300f3005b63c5f2892f600051141561039957341561028457600080fd5b6000610140526002546101605261018060006020818352015b600160016101605116141561030957600061018051602081106102bf57600080fd5b600160c052602060c0200154602082610220010152602081019050610140516020826102200101526020810190508061022052610220905080516020820120905061014052610362565b6000610140516020826101a0010152602081019050610180516020811061032f57600080fd5b600060c052602060c02001546020826101a0010152602081019050806101a0526101a09050805160208201209050610140525b610160600261037057600080fd5b60028151048152505b815160010180835281141561029d575b50506101405160005260206000f3005b63621fd130600051141561046f5734156103b257600080fd5b60606101c060246380673289610140526002546101605261015c6000305af16103da57600080fd5b6101e0805160200180610260828460006004600a8704601201f16103fd57600080fd5b50506102605160206001820306601f82010390506102c0610260516008818352015b826102c051111561042f5761044b565b60006102c05161028001535b815160010180835281141561041f575b5050506020610240526040610260510160206001820306601f8201039050610240f3005b6398b1e06a6000511415610d0e576020600461014037610220600435600401610160376102006004356004013511156104a757600080fd5b633b9aca006103c0526103c0516104bd57600080fd5b6103c05134046103a052633b9aca006103a05110156104db57600080fd5b6407735940006103a05111156104f057600080fd5b6002546103e05242610400526000606061070060246380673289610680526103a0516106a05261069c6000305af161052757600080fd5b61072060088060208461084001018260208501600060046012f150508051820191505060606107e06024638067328961076052610400516107805261077c6000305af161057357600080fd5b61080060088060208461084001018260208501600060046012f15050805182019150506101606102008060208461084001018260208501600060046045f150508051820191505080610840526108409050805160200180610420828460006004600a8704601201f16105e457600080fd5b50506000610aa0526002610ac052610ae060006020818352015b6000610ac05161060d57600080fd5b610ac0516103e05160016103e05101101561062757600080fd5b60016103e051010614151561063b576106a7565b610aa060605160018251018060405190131561065657600080fd5b809190121561066457600080fd5b815250610ac080511515610679576000610693565b600281516002835102041461068d57600080fd5b60028151025b8152505b81516001018083528114156105fe575b5050610420805160208201209050610b0052610b2060006020818352015b610aa051610b20511215610730576000610b2051602081106106e657600080fd5b600160c052602060c0200154602082610b40010152602081019050610b0051602082610b4001015260208101905080610b4052610b409050805160208201209050610b0052610735565b610746565b5b81516001018083528114156106c5575b5050610b0051610aa0516020811061075d57600080fd5b600160c052602060c0200155600280546001825401101561077d57600080fd5b60018154018155506020610c40600463c5f2892f610be052610bfc6000305af16107a657600080fd5b610c4051610bc0526060610ce060246380673289610c60526103e051610c8052610c7c6000305af16107d757600080fd5b610d00805160200180610d40828460006004600a8704601201f16107fa57600080fd5b50506040610dc052610dc051610e0052610420805160200180610dc051610e0001828460006004600a8704601201f161083257600080fd5b5050610dc051610e00015160206001820306601f8201039050610dc051610e0001610da08151610220818352015b83610da0511015156108715761088e565b6000610da0516020850101535b8151600101808352811415610860575b505050506020610dc051610e00015160206001820306601f8201039050610dc0510101610dc052610dc051610e2052610d40805160200180610dc051610e0001828460006004600a8704601201f16108e557600080fd5b5050610dc051610e00015160206001820306601f8201039050610dc051610e0001610da081516020818352015b83610da05110151561092357610940565b6000610da0516020850101535b8151600101808352811415610912575b505050506020610dc051610e00015160206001820306601f8201039050610dc0510101610dc0527f42dc88172194fbb332e0cb2fd0d4411b0b44a152a0d05a406b6790641bdefec0610dc051610e00a16407735940006103a0511415610d0c5760038054600182540110156109b457600080fd5b6001815401815550620100006003541415610d0b5742610e605242610e8052620151806109e057600080fd5b62015180610e805106610e605110156109f857600080fd5b42610e805262015180610a0a57600080fd5b62015180610e805106610e6051036202a30042610e605242610e805262015180610a3357600080fd5b62015180610e805106610e60511015610a4b57600080fd5b42610e805262015180610a5d57600080fd5b62015180610e805106610e605103011015610a7757600080fd5b6202a30042610e605242610e805262015180610a9257600080fd5b62015180610e805106610e60511015610aaa57600080fd5b42610e805262015180610abc57600080fd5b62015180610e805106610e60510301610e40526060610f2060246380673289610ea052600254610ec052610ebc6000305af1610af757600080fd5b610f40805160200180610f80828460006004600a8704601201f1610b1a57600080fd5b5050606061106060246380673289610fe052610e405161100052610ffc6000305af1610b4557600080fd5b6110808051602001806110c0828460006004600a8704601201f1610b6857600080fd5b5050610bc05161118052606061114052611140516111a052610f808051602001806111405161118001828460006004600a8704601201f1610ba857600080fd5b505061114051611180015160206001820306601f8201039050611140516111800161112081516020818352015b8361112051101515610be657610c03565b6000611120516020850101535b8151600101808352811415610bd5575b50505050602061114051611180015160206001820306601f820103905061114051010161114052611140516111c0526110c08051602001806111405161118001828460006004600a8704601201f1610c5a57600080fd5b505061114051611180015160206001820306601f8201039050611140516111800161112081516020818352015b8361112051101515610c9857610cb5565b6000611120516020850101535b8151600101808352811415610c87575b50505050602061114051611180015160206001820306601f8201039050611140510101611140527f08b71ef3f1b58f7a23ffb82e27f12f0888c8403f1ceb0ea7ea26b274e2189d4c61114051611180a160016004555b5b005b63845980e86000511415610d34573415610d2757600080fd5b60045460005260206000f3005b60006000fd5b6101f2610f2c036101f26000396101f2610f2c036000f3",
  }
};
