import React, {useEffect, useState} from "react";
import { ActivistProps } from "../../../../../../types/activist";
import { ContributorProps } from "../../../../../../types/contributor";
import { DeveloperProps } from "../../../../../../types/developer";
import { InspectorProps } from "../../../../../../types/inspector";
import { ResearcherProps } from "../../../../../../types/researcher";
import { SupporterProps } from "../../../../../../types/supporter";
import { ProducerProps, UserTypeProps } from "../../../../../../types/user";
import { ValidatorProps } from "../../../../../../types/validator";
import { getImage } from "../../../../../../services/getImage";

type UserProps = ProducerProps | InspectorProps | ResearcherProps | DeveloperProps | ContributorProps | ActivistProps | SupporterProps | ValidatorProps;
interface Props{
    user: UserProps;
    userType: UserTypeProps;
    getUsers: () => void;
}
export function UserTabItem({getUsers, user, userType}: Props){
    const [wallet, setWallet] = useState('');
    const [imageProfile, setImageProfile] = useState('');

    useEffect(() => {
        setData();
    }, [user, userType]);

    function setData(){
        if(userType === 1){
            if(user.userType === userType){
                setWallet(user.producerWallet);
                handleGetImageProfile(user.proofPhoto);
            }
        }

        if(userType === 2){
            if(user.userType === userType){
                setWallet(user.inspectorWallet);
                handleGetImageProfile(user.proofPhoto);
            }
        }

        if(userType === 3){
            if(user.userType === userType){
                setWallet(user.researcherWallet);
                handleGetImageProfile(user.proofPhoto);
            }
        }

        if(userType === 4){
            if(user.userType === userType){
                setWallet(user.developerWallet);
                handleGetImageProfile(user.proofPhoto);
            }
        }

        if(userType === 5){
            if(user.userType === userType){
                setWallet(user.contributorWallet);
                handleGetImageProfile(user.proofPhoto);
            }
        }

        if(userType === 6){
            if(user.userType === userType){
                setWallet(user.activistWallet);
                handleGetImageProfile(user.proofPhoto);
            }
        }

        if(userType === 7){
            if(user.userType === userType){
                setWallet(user.supporterWallet);
                setImageProfile('');
            }
        }

        if(userType === 8){
            if(user.userType === userType){
                setWallet(user.validatorWallet);
                setImageProfile('');
            }
        }
    }

    async function handleGetImageProfile(hash: string){
        const response = await getImage(hash);
        setImageProfile(response);
    }

    return(
        <div className="w-full p-3 rounded-md bg-container-primary">

        </div>
    )
}