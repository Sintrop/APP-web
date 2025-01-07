import React, { useState } from "react";
import { ResearcheProps } from "../../../../../types/researche";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { ModalWhereExecuteTransaction } from "../../../../../components/ModalWhereExecuteTransaction/ModalWhereExecuteTransaction";

interface Props{
    researche: ResearcheProps;
}
export function VoteResearcheItem({researche}: Props){
    const {t} = useTranslation();
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

    return(
        <div className="w-full p-3 rounded-md bg-container-secondary">
            <p className="text-white text-sm">#{researche.id}</p>
            <p className="text-white text-sm">{researche.createdBy}</p>

            {showInputJustification ? (
                <div className="flex flex-col w-full mt-2">
                    <label className="text-gray-300 text-sm">{t('digiteAJustificativaDoSeuVotoParaEssaPesquisa')}:</label>
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
                    <p className="text-white text-sm">Publicado na ERA: {researche.era} - Bloco: {researche.createdAtBlock}</p>
                    <p className="text-white text-sm">Válido: {researche.valid}</p>
                    <p className="text-white text-sm">Validações recebidas: {researche.validationsCount}</p>

                    <a
                        className="text-blue-500 underline w-fit"
                        href={`https://ipfs.io/ipfs/${researche.file}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Ver pesquisa
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
                    additionalData={JSON.stringify({ justification, researche })}
                    close={() => setShowModalWhereExecuteTransaction(false)}
                    success={successVote}
                    transactionType="voteResearche"
                />
            )}
        </div>
    )
}