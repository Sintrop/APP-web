import React, { useState } from "react";
import { ActionButton } from "../ActionButton/ActionButton";
import { actionsName, ModalRealizeAction } from "../ModalRealizeAction/ModalRealizeAction";

export function DeveloperActions() {
    const [actionType, setActionType] = useState<actionsName>('sendContribution');
    const [showModalRealizeAction, setShowModalRealizeAction] = useState(false);

    return (
        <div className="flex flex-col gap-3">
            <ActionButton
                onClick={() => {
                    setActionType('sendContribution');
                    setShowModalRealizeAction(true);
                }}
                label="Enviar relatório"
                description="Envie seu relatório de contribuição da ERA, para provar o seu desenvolvimento"
            />

            <ActionButton
                onClick={() => {
                    setActionType('withdrawTokens');
                    setShowModalRealizeAction(true);
                }}
                label="Sacar tokens"
                description="Saque seus tokens da sua pool, desde que tenha contribuido na ERA anterior"
            />

            <ActionButton
                onClick={() => {
                    setActionType('inviteUser');
                    setShowModalRealizeAction(true);
                }}
                label="Convidar desenvolvedor"
                description="Convide outros desenvolvedores para entar na comunidade"
            />

            {showModalRealizeAction && (
                <ModalRealizeAction
                    close={() => setShowModalRealizeAction(false)}
                    type={actionType}
                />
            )}
        </div>
    )
}