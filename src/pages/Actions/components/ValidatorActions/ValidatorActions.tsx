import React, { useState } from "react";
import { ActionButton } from "../ActionButton/ActionButton";
import { actionsName, ModalRealizeAction } from "../ModalRealizeAction/ModalRealizeAction";

export function ValidatorActions() {
    const [actionType, setActionType] = useState<actionsName>('withdrawTokens');
    const [showModalRealizeAction, setShowModalRealizeAction] = useState(false);

    return (
        <div className="flex flex-col gap-3">
            <ActionButton
                onClick={() => {
                    setActionType('inviteUser');
                    setShowModalRealizeAction(true);
                }}
                label="Convidar validador"
                description="Convide outros validadores para entar na comunidade"
            />

            <ActionButton
                onClick={() => {
                    setActionType('withdrawTokens');
                    setShowModalRealizeAction(true);
                }}
                label="Sacar tokens"
                description="Saque seus tokens pelos serviços prestados na era anterior"
            />

            <ActionButton
                onClick={() => {
                    setActionType('voteUser');
                    setShowModalRealizeAction(true);
                }}
                label="Votar em usuário"
                description="Vote para invalidar um usuário do sistema apresentando sua justificativa"
            />

            <ActionButton
                onClick={() => {
                    setActionType('voteInspection');
                    setShowModalRealizeAction(true);
                }}
                label="Votar em inspeção"
                description="Vote para invalidar uma inspeção do sistema apresentando sua justificativa"
            />

            <ActionButton
                onClick={() => {
                    setActionType('declareAlive');
                    setShowModalRealizeAction(true);
                }}
                label="Declarar estar vivo"
                description="Declare estar vivo, para que consiga votar para invalidar na próxima ERA"
            />

            {/* <ActionButton
                onClick={() => {
                    setActionType('voteDevContribution');
                    setShowModalRealizeAction(true);
                }}
                label="Votar em relatório dev"
                description="Vote para invalidar uma contribuição enviada por um desenvolvedor"
            />

            <ActionButton
                onClick={() => {
                    setActionType('voteResearche');
                    setShowModalRealizeAction(true);
                }}
                label="Votar em pesquisa"
                description="Vote para invalidar uma pesquisa enviada por um pesquisador"
            /> */}

            {showModalRealizeAction && (
                <ModalRealizeAction
                    close={() => setShowModalRealizeAction(false)}
                    type={actionType}
                />
            )}
        </div>
    )
}