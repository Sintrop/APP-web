import Web3 from "web3";
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { computePoolAddress, Pool, Route, SwapOptions, SwapQuoter, SwapRouter, Trade } from '@uniswap/v3-sdk';
import {Currency, CurrencyAmount, Percent, Token, TradeType} from '@uniswap/sdk-core'
import { CONFIG, SWAP_ROUTER_ADDRESS, TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER, MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS } from "./constants";
import {fromReadableAmount} from './utils';
import {ethers} from 'ethers';
import ERC20_ABI from './ERC20.json';

const web3js = new Web3(window.ethereum);
const walletAddress = '0x49b85E2d9f48252Bf32ba35221b361Da77AAc683'

export async function createTrade(){
    const poolInfo = await getPoolInfo();
    
    const pool = new Pool(
        CONFIG.tokens.in,
        CONFIG.tokens.out,
        CONFIG.tokens.poolFee,
        poolInfo.sqrtPriceX96.toString(),
        poolInfo.liquidity.toString(),
        Number(poolInfo.tick)
    )
    
    const swapRoute = new Route(
        [pool],
        CONFIG.tokens.in,
        CONFIG.tokens.out
    )
    
    const amountOut = await getOutputQuote(swapRoute)
    
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
            (Number(amountOut[0]) / 10**18).toFixed(0)
        ),
        tradeType: TradeType.EXACT_INPUT,
    })

    executeTrade(uncheckedTrade);
}

export async function executeTrade(trade){
    const tokenApproval = await getTokenTransferApproval(CONFIG.tokens.in);

    const options = {
        slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
        deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
        recipient: walletAddress
    }

    const methodParameters = SwapRouter.swapCallParameters([trade], options);

    const tx = {
        data: methodParameters.calldata,
        to: SWAP_ROUTER_ADDRESS,
        value: methodParameters.value,
        from: walletAddress,
        maxFeePerGas: MAX_FEE_PER_GAS,
        maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    }

    const send = await web3js.eth.sendTransaction(tx);
    console.log(send)
}

async function getPoolInfo(){
    const currentPoolAddress = computePoolAddress({
        factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
        tokenA: CONFIG.tokens.in,
        tokenB: CONFIG.tokens.out,
        fee: CONFIG.tokens.poolFee,
    })

    const poolContract = new web3js.eth.Contract(IUniswapV3PoolABI.abi, currentPoolAddress);
    
    const [token0, token1, fee, tickSpacing, liquidity, slot0] = await Promise.all([
        poolContract.methods.token0().call(),
        poolContract.methods.token1().call(),
        poolContract.methods.fee().call(),
        poolContract.methods.tickSpacing().call(),
        poolContract.methods.liquidity().call(),
        poolContract.methods.slot0().call()
    ]) 

    return {
        token0, 
        token1, 
        fee, 
        tickSpacing, 
        liquidity, 
        sqrtPriceX96: slot0[0],
        tick: slot0[1]
    }
}

async function getOutputQuote(swapRoute){
    const {calldata} = await SwapQuoter.quoteCallParameters(
        swapRoute,
        CurrencyAmount.fromRawAmount(
            CONFIG.tokens.in,
            `${CONFIG.tokens.amountIn}000000000000000000`
            // fromReadableAmount(
            //     CONFIG.tokens.amountIn,
            //     CONFIG.tokens.in.decimals
            // )
        ),
        TradeType.EXACT_INPUT,
        {
            useQuoterV2: true
        }
    )

    const quoteCallReturnData = await web3js.eth.call({
        to: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
        data: calldata
    });

    return ethers.utils.defaultAbiCoder.decode(['uint256'], quoteCallReturnData)
    //return ethers.AbiCoder.defaultAbiCoder().decode(['uint256'], quoteCallReturnData)
}

export async function getTokenTransferApproval(token) {
    try {
        const tokenContract = new web3js.eth.Contract(ERC20_ABI, token.address);

        const transaction = await tokenContract.methods.approve(
            SWAP_ROUTER_ADDRESS,
            fromReadableAmount(
                TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
                token.decimals
            ).toString()
        ).send({from: walletAddress})

        return {
            transaction,
            status: 'ok'
        };
    } catch (e) {
        alert('Erro ao aprovar os tokens')
        return{
            transaction: '',
            status: 'error'
        }
    }
  }