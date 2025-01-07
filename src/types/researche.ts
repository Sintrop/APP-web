export interface ResearcheProps {
    id: number;
    era: number;
    createdBy: string;
    title: string;
    thesis: string;
    file: string;
    validationsCount: number;
    valid: boolean;
    invalidatedAt: number;
    createdAtBlock: number;
}