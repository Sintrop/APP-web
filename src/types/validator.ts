export interface ValidatorProps {
    id: number;
    validatorWallet: string;
    pool: {
        currentEra: number;
        level: number;
    }
    userType: 8;
}

export interface UserValidationProps {
    validator: string;
    user: string;
    justification: string;
    majorityValidatorsCount: number;
    createdAtBlockNumber: number;
}