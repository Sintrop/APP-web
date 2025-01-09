import { InspectionProps } from "../../../types/inspection";
import { getInspections } from "../../web3/sintropService";

interface ReturnGetHistoryInspections{
    success: boolean;
    inspections: InspectionProps[];
}
export async function getInspectionsValidationCenter(): Promise<ReturnGetHistoryInspections>{
    try{
        const response = await getInspections();
        return {
            success: true,
            inspections: response,
        }
    }catch(e){
        console.log(e)
        return {
            success: false,
            inspections: [],
        }
    }
}