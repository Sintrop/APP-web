import React, { useEffect, useState } from "react";
import { ActivistProps } from "../../../../../../types/activist";
import { ContributorProps } from "../../../../../../types/contributor";
import { DeveloperProps } from "../../../../../../types/developer";
import { InspectorProps } from "../../../../../../types/inspector";
import { ResearcherProps } from "../../../../../../types/researcher";
import { SupporterProps } from "../../../../../../types/supporter";
import { ProducerProps, UserTypeProps } from "../../../../../../types/user";
import { UserValidationProps, ValidatorProps } from "../../../../../../types/validator";
import { getImage } from "../../../../../../services/getImage";
import { Jazzicon } from "@ukstv/jazzicon-react";
import { getUserValidationsValidationCenter } from "../../../../../../services/centers/validation/users";
import { ActivityIndicator } from "../../../../../../components/ActivityIndicator/ActivityIndicator";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { getUser } from "../../../../../../services/web3/userService";

type UserProps = ProducerProps | InspectorProps | ResearcherProps | DeveloperProps | ContributorProps | ActivistProps | SupporterProps | ValidatorProps;
interface Props {
    user: UserProps;
    userType: UserTypeProps;
    getUsers: () => void;
}
export function UserTabItem({ getUsers, user, userType }: Props) {
    const [wallet, setWallet] = useState('');
    const [imageProfile, setImageProfile] = useState('');
    const [isError, setIsError] = useState(false);
    const [validations, setValidations] = useState<UserValidationProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [showValidations, setShowValidations] = useState(false);
    const [invalidatedUser, setInvalidatedUser] = useState(false);

    useEffect(() => {
        setData();
    }, [user, userType]);

    useEffect(() => {
        getUserValidations();
    }, [wallet]);

    function setData() {
        if (userType === 1) {
            if (user.userType === userType) {
                setWallet(user.producerWallet);
                handleGetImageProfile(user.proofPhoto);
            }
        }

        if (userType === 2) {
            if (user.userType === userType) {
                setWallet(user.inspectorWallet);
                handleGetImageProfile(user.proofPhoto);
            }
        }

        if (userType === 3) {
            if (user.userType === userType) {
                setWallet(user.researcherWallet);
                handleGetImageProfile(user.proofPhoto);
            }
        }

        if (userType === 4) {
            if (user.userType === userType) {
                setWallet(user.developerWallet);
                handleGetImageProfile(user.proofPhoto);
            }
        }

        if (userType === 5) {
            if (user.userType === userType) {
                setWallet(user.contributorWallet);
                handleGetImageProfile(user.proofPhoto);
            }
        }

        if (userType === 6) {
            if (user.userType === userType) {
                setWallet(user.activistWallet);
                handleGetImageProfile(user.proofPhoto);
            }
        }

        if (userType === 7) {
            if (user.userType === userType) {
                setWallet(user.supporterWallet);
                setImageProfile('');
            }
        }

        if (userType === 8) {
            if (user.userType === userType) {
                setWallet(user.validatorWallet);
                setImageProfile('');
            }
        }
    }

    async function handleGetImageProfile(hash: string) {
        const response = await getImage(hash);
        setImageProfile(response);
    }

    async function getUserValidations() {
        if (wallet === '') return;

        setLoading(true);
        const response = await getUserValidationsValidationCenter(wallet);
        setIsError(!response.success);

        if (response.success) {
            setValidations(response.validations);
            if(validations.length > 0)checkInvalidatedUser();
        }

        setLoading(false)
    }

    async function checkInvalidatedUser(){
        const response = await getUser(wallet);
        if(response === 9){
            setInvalidatedUser(true);
        }
    }

    function toggleShowValidation() {
        setShowValidations(oldValue => !oldValue);
    }

    return (
        <div className={`w-full flex flex-col p-3 rounded-md bg-container-primary duration-300 ${showValidations ? 'h-[300px]' : 'h-[72px]'}`}>
            <div className="flex items-center justify-between gap-3">
                <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-container-secondary">
                        {imageProfile !== '' ? (
                            <img
                                src={imageProfile}
                                className="w-full h-full rounded-full object-cover"
                                alt="profile"
                            />
                        ) : (
                            <Jazzicon address={wallet} />
                        )}
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <p className="text-white font-semibold">{user.userType === 8 ? 'Validador' : user.name}</p>

                            {invalidatedUser && (
                                <div className="flex px-3 py-1 rounded-full bg-red-500">
                                    <p className="text-white text-xs">Usuário invalidado</p>
                                </div>
                            )}
                        </div>
                        <p className="text-white text-sm">{wallet}</p>
                    </div>
                </div>

                <div className="p-3 rounded-md bg-container-secondary">
                    {loading ? (
                        <ActivityIndicator size={25} />
                    ) : (
                        <div className="flex items-center gap-1">
                            <p className="text-white text-sm">Validações recebidas: {validations.length}</p>

                            {validations.length > 0 && (
                                <button
                                    onClick={toggleShowValidation}
                                >
                                    {showValidations ? (
                                        <BiChevronUp size={25} color='white' />
                                    ) : (
                                        <BiChevronDown size={25} color='white' />
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showValidations && (
                <div className="flex flex-col gap-3 bg-container-secondary rounded-md p-3 mt-5 h-full overflow-y-auto">
                    {validations.map(validation => (
                        <UserValidationItem
                            key={validation.validator}
                            validation={validation}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

interface UserValidationItemProps{
    validation: UserValidationProps;
}
function UserValidationItem({validation}: UserValidationItemProps){
    return(
        <div className="flex flex-col border-b border-container-primary py-3">
            <p className="text-white text-sm">Validador: {validation.validator}</p>
            <p className="text-white text-sm">Justificativa: {validation.justification}</p>
            <p className="text-white text-sm">Bloco: {validation.createdAtBlockNumber}</p>
        </div>  
    )
}