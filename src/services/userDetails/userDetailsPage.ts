import { ActivistProps } from "../../types/activist";
import { ContributorProps } from "../../types/contributor";
import { DeveloperProps } from "../../types/developer";
import { InspectorProps } from "../../types/inspector";
import { ResearcherProps } from "../../types/researcher";
import { SupporterProps } from "../../types/supporter";
import { ProducerProps, UserApiProps } from "../../types/user";
import { ValidatorProps } from "../../types/validator";
import { api } from "../api";
import { getActivist } from "../web3/activistService";
import { getContributor } from "../web3/contributorService";
import { getDeveloper } from "../web3/developersService";
import { getInspector } from "../web3/inspectorService";
import { GetProducer } from "../web3/producerService";
import { getResearcher } from "../web3/researchersService";
import { GetSupporter } from "../web3/supporterService";
import { getUser } from "../web3/userService";
import { getValidator } from "../web3/validatorService";

export type BlockchainUserDataProps = ProducerProps | InspectorProps | ResearcherProps | DeveloperProps | ContributorProps | ActivistProps | SupporterProps | ValidatorProps;

interface ReturnGetUserDetailsProps{
    success: boolean;
    userType: number;
    blockchainData?: BlockchainUserDataProps;
    userApi: UserApiProps;
}
export async function getUserDetailsPage(address: string): Promise<ReturnGetUserDetailsProps>{
    let userApi = {} as UserApiProps;
    
    try{

        const userType = await getUser(address);
        const blockchainData = await getUserBlockchain(userType, address);
        const responseUserApi = await getUserApi(address);
        if(responseUserApi.success){
            userApi = responseUserApi.userApi;
        }
    
        return{
            success: true,
            userType,
            blockchainData,
            userApi,
        }
    }catch(e){
        return{
            success: false,
            userType: 0,
            userApi,
        }
    }
}

async function getUserBlockchain(userType: number, address: string): Promise<BlockchainUserDataProps | undefined>{
    if(userType === 1){
        const response = await GetProducer(address);
        return {
            ...response,
            userType
        };
    }

    if(userType === 2){
        const response = await getInspector(address);
        return {
            ...response,
            userType
        };
    }

    if(userType === 3){
        const response = await getResearcher(address);
        return {
            ...response,
            userType
        };
    }

    if(userType === 4){
        const response = await getDeveloper(address);
        return {
            ...response,
            userType
        };
    }

    if(userType === 5){
        const response = await getContributor(address);
        return {
            ...response,
            userType
        };
    }

    if(userType === 6){
        const response = await getActivist(address);
        return {
            ...response,
            userType
        };
    }

    if(userType === 7){
        const response = await GetSupporter(address);
        return {
            ...response,
            userType
        };;
    }

    if(userType === 8){
        const response = await getValidator(address);
        return {
            ...response,
            userType
        };;
    }
}

interface ReturnGetUserApiProps{
    success: boolean;
    userApi: UserApiProps;
}
async function getUserApi(address: string): Promise<ReturnGetUserApiProps>{
    try{
        const response = await api.get(`/user/${address}`);
        return {
            success: true,
            userApi: response.data.user
        }
    }catch(e){
        console.log(e);
        return {
            success: false,
            userApi: {} as UserApiProps,
        }
    }
}