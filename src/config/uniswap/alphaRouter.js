// import { CurrencyAmount, Token, TradeType, ChainId } from "@uniswap/sdk-core";
// import { ethers, BigNumber } from "ethers";
// import { AlphaRouter } from "@uniswap/smart-order-router";
// import JSBI from "jsbi";

// const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/e46d8ac23f55416a9c93c0efa005450a');
// const idNetwork = 11155111
// const V3_SWAP_ROUTER_ADDRESS = "0x0227628f3F023bb0B980b67D528571c95c6DaC1c";

// const name0 = "Wrapped Ether";
// const symbol0 = "WETH";
// const decimals0 = 18;
// const address0 = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";

// const name1 = "RCT TOKEN";
// const symbol1 = "RCT";
// const decimals1 = 18;
// const address1 = "0xF8033Bbfe9c645F52d170DDD733274371E75369F";

// const WETH = new Token(idNetwork, address0, decimals0, symbol0, name0);
// const RCT = new Token(idNetwork, address1, decimals1, symbol1, name1); 

// const wei = ethers.utils.parseUnits('0.01', 18);


// const router = new AlphaRouter({chainId: ChainId.MAINNET, provider: provider,});

// export async function teste(){
//     console.log(router)
//     return;
//     const route = await router.route(
//         '10000000000000000000',
//         WETH,
//         TradeType.EXACT_INPUT
//     )
    
// }