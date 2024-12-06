import React, { useState } from "react";
import { ActionButton } from "../ActionButton/ActionButton";
import { actionsName, ModalRealizeAction } from "../ModalRealizeAction/ModalRealizeAction";

export function SupporterActions(){
    const [actionType, setActionType] = useState<actionsName>('withdrawTokens');
    const [showModalRealizeAction, setShowModalRealizeAction] = useState(false);

    return(
        <div className="flex flex-col gap-3">
            <ActionButton
                onClick={() => {
                    setActionType('inviteUser');
                    setShowModalRealizeAction(true);
                }}
                label="Convidar apoiador"
                description="Convide outros apoiadores para entar na comunidade"
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