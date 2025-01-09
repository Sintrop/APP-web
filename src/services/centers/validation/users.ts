import { ActivistProps } from "../../../types/activist";
import { ContributorProps } from "../../../types/contributor";
import { DeveloperProps } from "../../../types/developer";
import { InspectorProps } from "../../../types/inspector";
import { ResearcherProps } from "../../../types/researcher";
import { SupporterProps } from "../../../types/supporter";
import { ProducerProps } from "../../../types/user";
import { ValidatorProps } from "../../../types/validator";
import { getUsers } from "../../actions/voteUserService";

interface ReturnGetUsersValidationCenter{
    success: boolean;
    users: ProducerProps[] | InspectorProps[] | 
    ResearcherProps[] | DeveloperProps[] | 
    ContributorProps[] | ActivistProps[] |
    SupporterProps[] | ValidatorProps[]
}
export async function getUsersValidationCenter(userType: number): Promise<ReturnGetUsersValidationCenter>{
    try{
        const response = await getUsers(userType);
        return{
            success: true,
            users: response
        }
    }catch(e){
        console.log(e);
        return {
            success: false,
            users: [],
        }
    }
}