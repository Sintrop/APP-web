import React, { useEffect, useState } from "react";
import { useMainContext } from "../../../../../hooks/useMainContext";
import { ActivityIndicator } from "../../../../../components/ActivityIndicator/ActivityIndicator";
import { toast } from "react-toastify";
import { ModalWhereExecuteTransaction } from "../../../../../components/ModalWhereExecuteTransaction/ModalWhereExecuteTransaction";
import { useTranslation } from "react-i18next";
import { checkAvailableToInvite, checkCanInvite } from "../../../../../services/actions/inviteUser";

interface Props{
    close: () => void;
}
export function InviteUser({}: Props){
    //@ts-ignore
    const {userData, walletConnected} = useMainContext();
    const {t} = useTranslation();
    const [wallet, setWallet] = useState('');
    const [userTypeToInvite, setUserTypeToInvite] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingCanInvite, setLoadingCanInvite] = useState(false);
    const [blocksToNextInvite, setBlocksToNextInvite] = useState(0);
    const [youCanInvite, setYouCanInvite] = useState(false);
    const [showModalWhereExecuteTransaction, setShowModalWhereExecuteTransaction] = useState(false);
    const description = descriptionText[userData.userType as DescriptionTypes];

    useEffect(() => {
        if(userData?.userType === 6){
            setUserTypeToInvite(1);
        }else{
            setUserTypeToInvite(userData?.userType);
        }
        handleCheckCanInvite();
    }, [userData]);

    async function handleCheckCanInvite(){
        setLoadingCanInvite(true);

        const response = await checkCanInvite({walletConnected});
        setYouCanInvite(response.canInvite);
        if(response.blocksToNextInvite){
            setBlocksToNextInvite(response.blocksToNextInvite);
        }

        setLoadingCanInvite(false);
    }

    async function handleInvite(){
        if(userTypeToInvite === 0){
            toast.error(t('selecioneUmTipoDeUsuarioParaConvidar'));
            return;
        }
        
        setLoading(true);
        
        const check = await checkAvailableToInvite({walletToInvite: wallet});
        if(check.canInvite){
            setShowModalWhereExecuteTransaction(true);
            setLoading(false);
            return;
        }

        if(check.message === 'wallet not valid'){
            toast.error(t('insiraUmaWalletValida'))
        }

        if(check.message === 'user already exists'){
            toast.error(t('essaWalletJaEstaCadastrada'));
        }

        if(check.message === 'wallet invited'){
            toast.error(t('essaWalletJaFoiConvidada'));
        }
        setLoading(false);
    }

    function successInvite(type: string){
        handleCheckCanInvite();
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

    if(loadingCanInvite){
        return(
            <div className="flex w-full h-full items-center justify-center">
                <ActivityIndicator size={80}/>
            </div>
        )
    }

    if(!youCanInvite){
        return(
            <div className="flex flex-col w-full h-full items-center justify-center">
                <h3 className="font-semibold text-white text-lg text-center">{t('voceNaoPodeConvidarAgora')}</h3>
                <p className="text-white text-center mt-2">{t('espere')}: {blocksToNextInvite} {t('blocosParaConseguirConvidar')}</p>
            </div>
        )
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

            {userData?.userType === 6 && (
                <>
                    <label className="text-sm text-gray-400 mt-2">Selecione o tipo de usuário:</label>
                    <select
                        value={userTypeToInvite}
                        onChange={(e) => setUserTypeToInvite(Number(e.target.value))}
                        className="w-full h-10 bg-container-secondary rounded-md text-white px-2"
                    >
                        <option value={1}>{t('textProdutor')}</option>
                        <option value={2}>{t('textInspetor')}</option>
                        <option value={6}>{t('textAtivista')}</option>
                    </select>
                </>
            )}

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
    3: "Para convidar outro pesqusiador, insira a wallet dele abaixo. É importante que essa wallet não possua nenhum convite nem cadastro realizado.",
    4: "Para convidar outro desenvolvedor, insira a wallet dele abaixo. É importante que essa wallet não possua nenhum convite nem cadastro realizado.",
    5: "Para convidar outro contribuidor, insira a wallet dele abaixo. É importante que essa wallet não possua nenhum convite nem cadastro realizado.",
    6: "Para convidar outro usuário, insira a wallet dele abaixo e selecione qual tipo de usuário essa wallet vai se cadastrar. É importante que essa wallet não possua nenhum convite nem cadastro realizado.",
    7: "Para convidar outro apoiador, insira a wallet dele abaixo. É importante que essa wallet não possua nenhum convite nem cadastro realizado. Você receberá 5% de comissão ara toda contribuição que ele fizer!",
    8: "Para convidar outro validador, insira a wallet dele abaixo. É importante que essa wallet não possua nenhum convite nem cadastro realizado.",
}
type DescriptionTypes = keyof typeof descriptionText;