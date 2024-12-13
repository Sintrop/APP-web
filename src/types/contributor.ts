export interface ContributorProps{
    id: number;
    contributorWallet: string;
    name: string;
    createdAt: number;
    proofPhoto: string;
    pool:{
        currentEra: number;
        level: number;
    }
    userType: 5
}