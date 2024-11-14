export interface ContributionProps{
    id: number;
    era: number;
    level: number;
    validationsCount: number;
    invalidatedAt: number;
    createdAtBlockNumber: number;
    contributed: boolean;
    valid: boolean;
    report: string;
    developer: string;
}