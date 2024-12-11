import React, { useState } from "react";
import { actionsName, ModalRealizeAction } from "../ModalRealizeAction/ModalRealizeAction";
import { ActionButton } from "../ActionButton/ActionButton";

export function ActvistActions(){
    const [actionType, setActionType] = useState<actionsName>('inviteUser');
    const [showModalRealizeAction, setShowModalRealizeAction] = useState(false);
    
    return(
        <div className="flex flex-col gap-3">
            <ActionButton
                onClick={() => {
                    setActionType('inviteUser');
                    setShowModalRealizeAction(true);
                }}
                label="Convidar usuário"
                description="Convide outros usuários para entar na comunidade"
            />
            
            {showModalRealizeAction && (
                <ModalRealizeAction
                    type={actionType}
                    close={() => setShowModalRealizeAction(false)}
                />
            )}
        </div>
    )
}