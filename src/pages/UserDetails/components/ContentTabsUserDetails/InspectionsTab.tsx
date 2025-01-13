import React from "react";
import { BlockchainUserDataProps } from "../../../../services/userDetails/userDetailsPage";
import { UserApiProps } from "../../../../types/user";

interface Props {
    userType: number;
    blockchainData: BlockchainUserDataProps;
    userApi: UserApiProps;
    wallet: string;
}
export function InspectionsTab({}: Props){
    return(
        <div>

        </div>
    )
}