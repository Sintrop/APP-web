// import {AlphaRouter,ChainId,SwapOptionsSwapRouter02,SwapRoute,SwapType, JSBI}from '@uniswap/smart-order-router';
// import { TradeType, CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
// import {ethers, BigNumber} from 'ethers';
// import ERC20ABI from './ERC20.json';
// import { fromReadableAmount } from './utils';
// import { CONFIG } from './constants';


// const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/e46d8ac23f55416a9c93c0efa005450a');

// const V3_SWAP_ROUTER_ADDRESS = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD";
// const name0 = "Wrapped Ether";
// const symbol0 = "WETH";
// const decimals0 = 18;
// const address0 = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";

// const name1 = "RCT TOKEN";
// const symbol1 = "RCT";
// const decimals1 = 18;
// const address1 = "0xF8033Bbfe9c645F52d170DDD733274371E75369F";

// const WETH = new Token(ChainId.SEPOLIA, address0, decimals0, symbol0, name0); // Creating instances of `WETH`
// const RCT = new Token(ChainId.SEPOLIA, address1, decimals1, symbol1, name1); // Creating instances of `UNI`

// //export const getWethContract = () => new ethers.Contract(address0, ERC20ABI, provider);
// //export const getUniContract = () => new ethers.Contract(address1, ERC20ABI, provider);

// export async function generateRoute(walletAddress, amount){
//     const router = new AlphaRouter({ chainId: ChainId.SEPOLIA, provider: provider });
//     console.log(router)
//     const options = {
//         recipient: walletAddress,
//         slippageTolerance: new Percent(50, 10_000),
//         deadline: Math.floor(Date.now() / 1000 + 1800),
//         type: SwapType.SWAP_ROUTER_02,
//     }
    
//     const route = await router.route(
//         CurrencyAmount.fromRawAmount(
//             CONFIG.tokens.in,
//             fromReadableAmount(
//                 CONFIG.tokens.amountIn,
//                 decimals0
//                 ).toString()
//                 ),
//                 CONFIG.tokens.out,
//                 TradeType.EXACT_INPUT,
//                 options
//                 )
//                 return;


//     return route;
// }