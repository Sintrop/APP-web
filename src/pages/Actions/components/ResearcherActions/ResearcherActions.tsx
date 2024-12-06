import React, { useState } from "react";
import { ActionButton } from "../ActionButton/ActionButton";
import { actionsName, ModalRealizeAction } from "../ModalRealizeAction/ModalRealizeAction";

export function ResearcherActions() {
    const [actionType, setActionType] = useState<actionsName>('withdrawTokens');
    const [showModalRealizeAction, setShowModalRealizeAction] = useState(false);

    return (
        <div className="flex flex-col gap-3">
            <ActionButton
                onClick={() => {
                    setActionType('publishResearche');
                    setShowModalRealizeAction(true);
                }}
                label="Publicar pesquisa"
                description="Publique suas pesquisas"
            />

            <ActionButton
                onClick={() => {
                    setActionType('withdrawTokens');
                    setShowModalRealizeAction(true);
                }}
                label="Sacar tokens"
                description="Saque seus tokens da sua pool, desde que tenha publicado uma pesquisa na última era"
            />

            <ActionButton
                onClick={() => {
                    setActionType('inviteUser');
                    setShowModalRealizeAction(true);
                }}
                label="Convidar pesquisador"
                description="Convide outros pesquisadores para entar na comunidade"
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