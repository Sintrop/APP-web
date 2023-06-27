import { Currency, CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core';
import { Pool, Route, SwapOptions, SwapQuoter, SwapRouter, Trade, computePoolAddress} from '@uniswap/v3-sdk';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { ethers, BigNumber } from 'ethers';
import { CONFIG, QUOTER_CONTRACT_ADDRESS, POOL_FACTORY_CONTRACT_ADDRESS, SWAP_ROUTER_ADDRESS, MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS, TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER } from './constants';
import JSBI from 'jsbi';
import { fromReadableAmount } from './utils';
import ERC20_ABI from './ERC20.json';
import Web3 from 'web3';

const provider = new Web3('https://eth-rpc.gateway.pokt.network');
//const provider = new ethers.providers.JsonRpcProvider('https://eth-rpc.gateway.pokt.network');
const walletAddress = '0xE8282Fc7340E6767F4f5d8039dB963D86D79ca6C'
//https://sepolia.infura.io/v3/e46d8ac23f55416a9c93c0efa005450a

export async function createTrade(){
    const poolInfo = await getPoolInfo()
  
    const pool = new Pool(
      CONFIG.tokens.in,
      CONFIG.tokens.out,
      CONFIG.tokens.poolFee,
      String(poolInfo.sqrtPriceX96),
      String(poolInfo.liquidity),
      Number(poolInfo.tick)
    )
  
    const swapRoute = new Route(
      [pool],
      CONFIG.tokens.in,
      CONFIG.tokens.out
    )
  
    //const amountOut = await getOutputQuote(swapRoute)
    
    const uncheckedTrade = Trade.createUncheckedTrade({
      route: swapRoute,
      inputAmount: CurrencyAmount.fromRawAmount(
        CONFIG.tokens.in,
        fromReadableAmount(
          CONFIG.tokens.amountIn,
          CONFIG.tokens.in.decimals
        ).toString()
      ),
      outputAmount: CurrencyAmount.fromRawAmount(
        CONFIG.tokens.out,
        '10000000000000000000'
      ),
      tradeType: TradeType.EXACT_INPUT,
    })

  
    //console.log(uncheckedTrade)
    executeTrade(uncheckedTrade)
    return uncheckedTrade
}

export async function executeTrade(trade){
    console.log(trade)
    if (!walletAddress || !provider) {
      throw new Error('Cannot execute a trade without a connected wallet')
    }
  
    // Give approval to the router to spend the token
    //const tokenApproval = await getTokenTransferApproval(CONFIG.tokens.in)
  
    // Fail if transfer approvals do not go through
    
  
    const options = {
      slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
      deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
      recipient: walletAddress,
    }
  
    const methodParameters = SwapRouter.swapCallParameters([trade], options)
  
    const tx = {
      data: methodParameters.calldata,
      to: SWAP_ROUTER_ADDRESS,
      value: methodParameters.value,
      from: walletAddress,
      maxFeePerGas: MAX_FEE_PER_GAS,
      maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    }
  
    const res = await provider.eth.sendTransaction(tx)
  
    return res
  }

export async function getPoolInfo(){
    if (!provider) {
      throw new Error('No provider')
    }
  
    const currentPoolAddress = computePoolAddress({
      factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
      tokenA: CONFIG.tokens.in,
      tokenB: CONFIG.tokens.out,
      fee: CONFIG.tokens.poolFee,
    })

    const poolContract = new provider.eth.Contract(IUniswapV3PoolABI.abi, currentPoolAddress)
  
    const [token0, token1, fee, tickSpacing, liquidity, slot0] =
    await Promise.all([
        poolContract.methods.token0().call(),
        poolContract.methods.token1().call(),
        poolContract.methods.fee().call(),
        poolContract.methods.tickSpacing().call(),
        poolContract.methods.liquidity().call(),
        poolContract.methods.slot0().call(),
    ])
  
    return {
      token0,
      token1,
      fee,
      tickSpacing,
      liquidity,
      sqrtPriceX96: slot0[0],
      tick: slot0[1],
    }
}

async function getOutputQuote(route) {
    if (!provider) {
      throw new Error('Provider required to get pool state')
    }
  
    const { calldata } = await SwapQuoter.quoteCallParameters(
      route,
      CurrencyAmount.fromRawAmount(
        CONFIG.tokens.in,
        fromReadableAmount(
          CONFIG.tokens.amountIn,
          CONFIG.tokens.in.decimals
        ).toString()
      ),
      TradeType.EXACT_INPUT,
      {
        useQuoterV2: true,
      }
    )
  
    const quoteCallReturnData = await provider.call({
      to: QUOTER_CONTRACT_ADDRESS,
      data: calldata,
    })

    return ethers.utils.defaultAbiCoder.decode(['uint256'], quoteCallReturnData)
}

export async function getTokenTransferApproval(token){
    
    if (!provider || !walletAddress) {
      console.log('No Provider Found')
      return {
        status: 'error'
      }
    }
  
    try {
        const tokenContract = new provider.eth.Contract(ERC20_ABI, token.address)
    
        const transaction = await tokenContract.methods.approve(
            SWAP_ROUTER_ADDRESS,
            fromReadableAmount(
                TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
                token.decimals
            ).toString()
        ).send({from: walletAddress})
    
        const res = await provider.eth.sendTransaction(transaction)

        return res;
    } catch (e) {
        console.error(e)
        return {
            status: 'error'
        }
    }
}