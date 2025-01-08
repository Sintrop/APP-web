import React, { useState } from "react";
import { ActionButton } from "../ActionButton/ActionButton";
import { actionsName, ModalRealizeAction } from "../ModalRealizeAction/ModalRealizeAction";

export function ContributorActions() {
    const [actionType, setActionType] = useState<actionsName>('withdrawTokens');
    const [showModalRealizeAction, setShowModalRealizeAction] = useState(false);

    return (
        <div className="flex flex-col gap-3">
            <ActionButton
                onClick={() => {
                    setActionType('inviteUser');
                    setShowModalRealizeAction(true);
                }}
                label="Convidar contribuidor"
                description="Convide outros contribuidores para entar na comunidade"
            />

            <ActionButton
                onClick={() => {
                    setActionType('withdrawTokens');
                    setShowModalRealizeAction(true);
                }}
                label="Sacar tokens"
                description="Saque seus tokens pelos serviços prestados na era anterior"
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