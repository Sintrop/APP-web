// import { Currency, CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core';
// import { Pool, Route, SwapOptions, SwapQuoter, SwapRouter, Trade, FeeAmount, computePoolAddress } from '@uniswap/v3-sdk';
// import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
// import { ethers } from 'ethers';
// import { fromReadableAmount } from './utils'

// const idNetwork = 11155111;
// const ammount = 10;
// const PoolFactoryAddress = '0x0227628f3F023bb0B980b67D528571c95c6DaC1c';
// const QUOTER_CONTRACT_ADDRESS = '0x0227628f3F023bb0B980b67D528571c95c6DaC1c'
// const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/e46d8ac23f55416a9c93c0efa005450a');

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

// export async function createTrade(){
//     const poolInfo = await getPoolInfo();
//     console.log(poolInfo);
//     return;
  
//     const pool = new Pool(
//         RCT,
//         WETH,
//         FeeAmount.MEDIUM,
//         poolInfo.sqrtPriceX96.toString(),
//         poolInfo.liquidity.toString(),
//         poolInfo.tick
//     )
  
//     const swapRoute = new Route(
//         [pool],
//         RCT,
//         WETH
//     )
  
//     const amountOut = await getOutputQuote(swapRoute)
    
//     const uncheckedTrade = Trade.createUncheckedTrade({
//         route: swapRoute,
//         inputAmount: CurrencyAmount.fromRawAmount(
//             RCT,
//             fromReadableAmount(
//             ammount,
//             18
//             ).toString()
//         ),
//         outputAmount: CurrencyAmount.fromRawAmount(
//             WETH,
//             amountOut //JSBI
//         ),
//         tradeType: TradeType.EXACT_INPUT,
//     })
  
//     return uncheckedTrade
// }

// export async function getPoolInfo(){
//     const currentPoolAddress = computePoolAddress({
//       factoryAddress: PoolFactoryAddress,
//       tokenA: RCT,
//       tokenB: WETH,
//       fee: FeeAmount.MEDIUM,
//     })
  
//     const poolContract = new ethers.Contract(
//       currentPoolAddress,
//       IUniswapV3PoolABI.abi,
//       provider
//     )
  
//     const [token0, token1, fee, tickSpacing, liquidity, slot0] =
//       await Promise.all([
//         poolContract.token0(),
//         poolContract.token1(),
//         poolContract.fee(),
//         poolContract.tickSpacing(),
//         poolContract.liquidity(),
//         poolContract.slot0(),
//       ])
  
//     return {
//       token0,
//       token1,
//       fee,
//       tickSpacing,
//       liquidity,
//       sqrtPriceX96: slot0[0],
//       tick: slot0[1],
//     }
// }

// async function getOutputQuote(route){
//     const { calldata } = await SwapQuoter.quoteCallParameters(
//         route,
//         CurrencyAmount.fromRawAmount(
//             RCT,
//             fromReadableAmount(
//                 ammount,
//                 18
//             ).toString()
//         ),
//         TradeType.EXACT_INPUT,
//         {
//             useQuoterV2: true,
//         }
//     )
  
//     const quoteCallReturnData = await provider.call({
//         to: QUOTER_CONTRACT_ADDRESS,
//         data: calldata,
//     })
  
//     return ethers.utils.defaultAbiCoder.decode(['uint256'], quoteCallReturnData)
//   }