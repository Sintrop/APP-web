import { PublicationProps } from "../../types/publication";
import { api } from "../api";

interface ReturnGetPublicationsUserDetails{
    success: boolean;
    publications: PublicationProps[];
}
export async function getPublicationsUserDetails(userId: string): Promise<ReturnGetPublicationsUserDetails>{
    try{
        const response = await api.get(`/publications/${userId}`);
        return {
            success: true,
            publications: response.data.publications,
        }
    }catch(e){
        console.log(e);
        return{
            success: false,
            publications: [],
        }
    }
}