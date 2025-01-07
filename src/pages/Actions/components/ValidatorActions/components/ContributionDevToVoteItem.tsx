import React, { useState } from "react";
import { ContributionProps } from "../../../../../types/developer";
import { useTranslation } from "react-i18next";
import { ModalWhereExecuteTransaction } from "../../../../../components/ModalWhereExecuteTransaction/ModalWhereExecuteTransaction";
import { toast } from "react-toastify";

interface Props {
    contribution: ContributionProps;
}
export function ContributionDevToVoteItem({ contribution }: Props) {
    const { t } = useTranslation();
    const [showModalWhereExecuteTransaction, setShowModalWhereExecuteTransaction] = useState(false);
    const [showInputJustification, setShowInputJustification] = useState(false);
    const [justification, setJustification] = useState('');

    function handleCancelSendVote() {
        setShowInputJustification(false);
        setJustification('');
    }

    function handleSendVote() {
        setShowModalWhereExecuteTransaction(true);
    }

    function successVote(type: string){
        setShowModalWhereExecuteTransaction(false);
        handleCancelSendVote();
        if(type === 'blockchain'){
            toast.success(t('votoEnviadoComSucesso'));
        }

        if(type === 'checkout'){
            toast.success(t('transacaoEnviadaCheckout'));
        }
    }

    return (
        <div className="w-full p-3 rounded-md bg-container-secondary">
            <p className="text-white text-sm">#{contribution.id}</p>
            <p className="text-white text-sm">{contribution.developer}</p>

            {showInputJustification ? (
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
            ) : (
                <>
                    <p className="text-white text-sm">Publicado na ERA: {contribution.era} - Bloco: {contribution.createdAtBlockNumber}</p>
                    <p className="text-white text-sm">Válido: {contribution.valid}</p>
                    <p className="text-white text-sm">Validações recebidas: {contribution.validationsCount}</p>

                    <a
                        className="text-blue-500 underline w-fit"
                        href={`https://ipfs.io/ipfs/${contribution.report}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Ver contribuição
                    </a>

                    <button
                        className="mt-5 w-full bg-blue-primary text-white font-semibold rounded-md h-12"
                        onClick={() => setShowInputJustification(true)}
                    >
                        Votar para invalidar
                    </button>
                </>
            )}

            {showModalWhereExecuteTransaction && (
                <ModalWhereExecuteTransaction
                    additionalData={JSON.stringify({ justification, contribution })}
                    close={() => setShowModalWhereExecuteTransaction(false)}
                    success={successVote}
                    transactionType="voteContributionDev"
                />
            )}
        </div>
    )
}