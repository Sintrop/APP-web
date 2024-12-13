export interface InspectionProps{
    id: number;
    status: string;
    producer: string;
    inspector: string;
    regenerationScore: string;
    proofPhoto: string;
    report: string;
    validationsCount: number;
    createdAt: number;
    acceptedAt: number;
    inspectedAt: number;
    inspectedAtEra: number;
    invalidatedAt: number;
}