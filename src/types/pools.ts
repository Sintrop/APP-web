export interface BasicDataPoolProps{
    tokensPerEra: number;
    currentEra: number;
    balanceContract: number;
    epoch: number;
}

export interface ReturnGetPoolDataProps{
    success: boolean;
    poolData?: BasicDataPoolProps;
}

export interface ReturnGetNextWithdraw{
    success: boolean;
    nextWithdraw: number;
}