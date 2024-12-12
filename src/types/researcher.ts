export interface ResearcherProps{
    id: number;
    researcherWallet: string;
    name: string;
    proofPhoto: string;
    publishedWorks: number;
    lastPublishedAt: number;
    pool: {
        level: number;
        currentEra: number;
    }
    userType: 3;
}