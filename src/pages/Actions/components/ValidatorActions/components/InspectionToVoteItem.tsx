import React, { useState } from "react";
import { InspectionProps } from "../../../../../types/inspection";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { ModalWhereExecuteTransaction } from "../../../../../components/ModalWhereExecuteTransaction/ModalWhereExecuteTransaction";

interface Props{
    inspection: InspectionProps;
    getInspections: () => void;
}
export function InspectionToVoteItem({inspection, getInspections}: Props){
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [showInputJustification, setShowInputJustification] = useState(false);
    const [justification, setJustification] = useState('');
    const [showModalWhereExecuteTransaction, setShowModalWhereExecuteTransaction] = useState(false);

    function handleNavigateToInspection(){
        navigate(`/result-inspection/${inspection.id}`)
    }

    function handleCancelSendVote(){
        setShowInputJustification(false);
        setJustification('');
    }

    function successVote(type: string){
        setShowModalWhereExecuteTransaction(false);
        handleCancelSendVote();
        if(type === 'blockchain'){
            toast.success(t('votoEnviadoComSucesso'));
            getInspections();
        }

        if(type === 'checkout'){
            toast.success(t('transacaoEnviadaCheckout'));
        }
    }

    async function handleSendVote() {
        setShowModalWhereExecuteTransaction(true);
    }

    return (
        <div className="w-full flex flex-col p-2 rounded-md bg-container-secondary">
            <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                    <p className="font-bold text-white">{t('inspecao')} #{inspection.id}</p>
                    <p className="text-white text-sm">{t('criadaEm')}: {inspection.createdAt}</p>
                    <p className="text-white text-sm">{t('aceitaEm')}: {inspection.acceptedAt}</p>
                    <p className="text-white text-sm">{t('realizadaEm')}: {inspection.inspectedAt}</p>
                    <p className="text-white text-sm">{t('votosRecebidos')}: {inspection.validationsCount}</p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        className="w-32 h-8 rounded-md bg-green-primary text-white font-semibold text-sm"
                        onClick={handleNavigateToInspection}
                    >
                        {t('verInspecao')}
                    </button>

                    {!showInputJustification && (
                        <button
                            className="w-32 h-8 rounded-md bg-blue-primary text-white font-semibold text-sm"
                            onClick={() => setShowInputJustification(true)}
                        >
                            {t('votar')}
                        </button>
                    )}
                </div>
            </div>

            {showInputJustification && (
                <div className="flex flex-col w-full mt-2">
                    <label className="text-gray-300 text-sm">{t('digiteAJustificativaDoSeuVotoParaEssaInspecao')}:</label>
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
                    additionalData={JSON.stringify({justification, inspectionId: inspection.id})}
                    close={() => setShowModalWhereExecuteTransaction(false)}
                    success={successVote}
                    transactionType="voteInspection"
                />
            )}
        </div>
    )
}