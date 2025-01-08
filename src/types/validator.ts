export interface ValidatorProps{
    id: number;
    validatorWallet: string;
    pool: {
        currentEra: number;
        level: number;
    }
    userType: 8;
}