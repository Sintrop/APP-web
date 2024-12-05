import React, { useEffect, useState } from "react";
import { useMainContext } from "../../../../../hooks/useMainContext";
import { ActivityIndicator } from "../../../../../components/ActivityIndicator/ActivityIndicator";
import { api } from "../../../../../services/api";
import { toast } from "react-toastify";
import { ModalWhereExecuteTransaction } from "../../../../../components/ModalWhereExecuteTransaction/ModalWhereExecuteTransaction";
import { useTranslation } from "react-i18next";

interface Props{
    close: () => void;
}
export function InviteUser({}: Props){
    //@ts-ignore
    const {userData} = useMainContext();
    const {t} = useTranslation();
    const [wallet, setWallet] = useState('');
    const [userTypeToInvite, setUserTypeToInvite] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showModalWhereExecuteTransaction, setShowModalWhereExecuteTransaction] = useState(false);
    const description = descriptionText[userData.userType as DescriptionTypes];

    useEffect(() => {
        if(userData?.userType !== 6){
            setUserTypeToInvite(userData?.userType);
        }
    }, [userData]);

    async function handleInvite(){
        if(userTypeToInvite === 0){
            toast.error(t('selecioneUmTipoDeUsuarioParaConvidar'))
            return;
        }
        try{
            setLoading(true);
            const response = await api.get(`/invites/${wallet}`);
            if(response.data.invite.userType !== 0){
                toast.error(t('essaWalletJaFoiConvidada'));
                return;
            }
        }catch(e){
            console.log(e);
        }finally{
            setLoading(false);
        }

        try{
            setLoading(true);
            const response = await api.get(`/user/${wallet}`);
            if(response.data.user){
                toast.error(t('essaWalletJaEstaCadastrada'));
                return;
            }
        }catch(e){
            console.log(e);
            setShowModalWhereExecuteTransaction(true);
        }finally{
            setLoading(false);
        }
    }

    function successInvite(type: string){
        setShowModalWhereExecuteTransaction(false);
        if(type === 'blockchain'){
            setWallet('');
            toast.success(t('conviteEnviadoComSuccesso'));
        }

        if(type === 'checkout'){
            setWallet('');
            toast.success(t('transacaoEnviadaCheckout'));
        }
    }

    return(
        <div className="flex flex-col w-full">
            <p className="text-white">{description}</p>
            <input
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="Digite a wallet aqui"
                className="w-full px-2 h-10 rounded-md bg-container-secondary text-white mt-2"
            />

            <button
                className="w-full h-10 rounded-md mt-5 bg-blue-primary text-white flex items-center justify-center"
                disabled={loading}
                onClick={handleInvite}
            >
                {loading ? (
                    <ActivityIndicator size={25}/>
                ) : 'Convidar usuário'}
            </button>

            {showModalWhereExecuteTransaction && (
                <ModalWhereExecuteTransaction
                    additionalData={JSON.stringify({
                        walletToInvite: wallet,
                        userTypeToInvite,
                    })}
                    close={() => setShowModalWhereExecuteTransaction(false)}
                    success={successInvite}
                    transactionType="inviteUser"
                />
            )}
        </div>
    )
}

const descriptionText = {
    4: "Para convidar outro desenvolvedor, insira a wallet dele abaixo. É importante que essa wallet não possua nenhum convite nem cadastro realizado."
}
type DescriptionTypes = keyof typeof descriptionText;