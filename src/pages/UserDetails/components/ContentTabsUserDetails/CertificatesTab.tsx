import React from "react";
import { BlockchainUserDataProps } from "../../../../services/userDetails/userDetailsPage";
import { UserApiProps } from "../../../../types/user";

interface Props{
    userType: number;
    blockchainData: BlockchainUserDataProps;
    userApi: UserApiProps;
    wallet: string;
}
export function CertificatesTab({}: Props){
    return(
        <div className="mt-5 w-full p-3 rounded-md bg-container-primary">
            <p className="text-white">Visualização em desenvolvimento</p>
        </div>
    )
}