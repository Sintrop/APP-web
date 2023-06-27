import { Token } from '@uniswap/sdk-core';
import { FeeAmount } from '@uniswap/v3-sdk';

export const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
export const QUOTER_CONTRACT_ADDRESS = '0x61fFE014bA17989E743c5F6cB21bF9697530B21e';
export const SWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564';
export const WETH_CONTRACT_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

export const MAX_FEE_PER_GAS = 100000000000
export const MAX_PRIORITY_FEE_PER_GAS = 100000000000
export const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 2000

export const WETH_TOKEN = new Token(
    1,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether'
)
  
export const USDC_TOKEN = new Token(
    1,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    6,
    'USDC',
    'USD//C'
)

export const RCT_TOKEN = new Token(
    11155111,
    '0xF8033Bbfe9c645F52d170DDD733274371E75369F',
    18,
    'RCT',
    'Regeneration Credit Token'
)

export const WETH_TOKEN_SEPOLIA = new Token(
    11155111,
    '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
    18,
    'WETH',
    'Wrapped Ether'
)

export const CONFIG = {
    tokens: {
        in: WETH_TOKEN,
        amountIn: 100,
        out: USDC_TOKEN,
        poolFee: FeeAmount.MEDIUM,
    },
}