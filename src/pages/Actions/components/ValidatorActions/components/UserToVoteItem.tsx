import React, { useEffect, useState } from "react";
import { ProducerProps, UserTypeProps } from "../../../../../types/user";
import { DeveloperProps } from "../../../../../types/developer";
import { useTranslation } from "react-i18next";
import { ModalWhereExecuteTransaction } from "../../../../../components/ModalWhereExecuteTransaction/ModalWhereExecuteTransaction";
import { getImage } from "../../../../../services/getImage";
import { toast } from "react-toastify";
import { InspectorProps } from "../../../../../types/inspector";
import { ResearcherProps } from "../../../../../types/researcher";
import { ContributorProps } from "../../../../../types/contributor";
import { ActivistProps } from "../../../../../types/activist";

type UserProps = ProducerProps | InspectorProps | ResearcherProps | DeveloperProps | ContributorProps | ActivistProps;
interface Props{
    user: UserProps;
    userType: UserTypeProps;
    getUsers: () => void;
}
export function UserToVoteItem({userType, user, getUsers}: Props){
    const {t} = useTranslation();
    const [wallet, setWallet] = useState('');
    const [showInputJustification, setShowInputJustification] = useState(false);
    const [justification, setJustification] = useState('');
    const [showModalWhereExecuteTransaction, setShowModalWhereExecuteTransaction] = useState(false);
    const [imageProfile, setImageProfile] = useState('');

    useEffect(() => {
        setData();
    }, []);

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
    }

    function handleCancelSendVote(){
        setShowInputJustification(false);
        setJustification('');
    }

    function handleSendVote(){
        setShowModalWhereExecuteTransaction(true);
    }

    async function handleGetImageProfile(hash: string){
        const response = await getImage(hash);
        setImageProfile(response);
    }

    function successVote(type: string){
        setShowModalWhereExecuteTransaction(false);
        handleCancelSendVote();
        if(type === 'blockchain'){
            toast.success(t('votoEnviadoComSucesso'));
            getUsers();
        }

        if(type === 'checkout'){
            toast.success(t('transacaoEnviadaCheckout'));
        }
    }

    return (
        <div className="w-full p-2 rounded-md bg-container-secondary">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-container-primary">
                    {imageProfile !== '' && (
                        <img
                            src={imageProfile}
                            alt='profile'
                            className="w-full h-full rounded-full object-cover"
                        />
                    )}
                </div>

                <div className="flex flex-col max-w-[70%]">
                    <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-white text-sm truncate">{wallet}</p>
                </div>

                {!showInputJustification && (
                    <button
                        className="w-12 h-8 rounded-md items-center justify-center text-sm text-white font-semibold bg-blue-primary"
                        onClick={() => setShowInputJustification(true)}
                    >
                        {t('votar')}
                    </button>
                )}
            </div>

            {showInputJustification && (
                <div className="flex flex-col w-full mt-2">
                    <label className="text-gray-300 text-sm">{t('digiteAJustificativaDoSeuVotoParaEsseUsuario')}:</label>
                    <input
                        value={justification}
                        onChange={(e) => setJustification(e.target.value)}
                        className="w-full h-10 rounded-md bg-container-primary text-white px-2"
                        placeholder="Digite aqui"
                    />

                    <div className="flex items-center w-full mt-5">
                        <button
                            onClick={handleCancelSendVote}
                            className="w-[48%] items-center justify-center font-semibold text-white h-10"
                        >
                            {t('cancelar')}
                        </button>

                        <button
                            onClick={handleSendVote}
                            className={`w-[48%] items-center justify-center font-semibold text-white h-10 rounded-md bg-blue-primary ${justification.trim() ? 'opacity-100' : 'opacity-40'} duration-300`}
                            disabled={!justification.trim()}
                        >
                            {t('enviarVoto')}
                        </button>
                    </div>
                </div>
            )}

            {showModalWhereExecuteTransaction && (
                <ModalWhereExecuteTransaction
                    additionalData={JSON.stringify({justification, walletToVote: wallet})}
                    close={() => setShowModalWhereExecuteTransaction(false)}
                    success={successVote}
                    transactionType="voteUser"
                />
            )}
        </div>
    )
}