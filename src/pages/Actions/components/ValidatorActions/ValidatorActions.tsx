import React, { useState } from "react";
import { ActionButton } from "../ActionButton/ActionButton";
import { actionsName, ModalRealizeAction } from "../ModalRealizeAction/ModalRealizeAction";

export function ValidatorActions(){
    const [actionType, setActionType] = useState<actionsName>('withdrawTokens');
    const [showModalRealizeAction, setShowModalRealizeAction] = useState(false);

    return(
        <div className="flex flex-col gap-3">
            <ActionButton
                onClick={() => {
                    setActionType('inviteUser');
                    setShowModalRealizeAction(true);
                }}
                label="Convidar validador"
                description="Convide outros validadores para entar na comunidade"
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