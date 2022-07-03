import { ethers } from "ethers";
// import { Contract, Provider, setMulticallAddress } from "ethers-multicall";

const Abis = require("./contracts/abis.json");
const Addresses = require("./contracts/addresses.json");

const supportChainId = 4002;
// const multicallAddress = "0x402C435EA85DFdA24181141De1DE66bad67Cdf12";
// setMulticallAddress(supportChainId, multicallAddress);

const RPCS = {
    1: "http://13.59.118.124/eth",
    4002: "https://rpc.testnet.fantom.network",
    // 1337: "http://localhost:7545",
    // 31337: "http://localhost:8545/",
};
const providers = {
    // 1: new ethers.providers.JsonRpcProvider(RPCS[1]),
    4002: new ethers.providers.JsonRpcProvider(RPCS[4002]),
    // 1337: new ethers.providers.JsonRpcProvider(RPCS[1337]),
    // 31337: new ethers.providers.JsonRpcProvider(RPCS[31337]),
};

const provider = providers[supportChainId];

const testToken = new ethers.Contract(Addresses.TestToken, Abis.TestToken, provider);

const marketplaceContract = new ethers.Contract(
    Addresses.Marketplace,
    Abis.Marketplace,
    provider
);

const getNFTContract = (address) => {
    return new ethers.Contract(address, Abis.NFT, provider);
};

export {
    supportChainId,
    provider,
    marketplaceContract,
    testToken,
    getNFTContract,
};
