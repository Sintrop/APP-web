import React, { useState } from "react";
import { ActionButton } from "../ActionButton/ActionButton";
import { actionsName, ModalRealizeAction } from "../ModalRealizeAction/ModalRealizeAction";

export function DeveloperActions(){
    const [actionType, setActionType] = useState<actionsName>('sendContribution');
    const [showModalRealizeAction, setShowModalRealizeAction] = useState(false);

    return(
        <div className="flex flex-col gap-3">
            <ActionButton
                onClick={() => {
                    setActionType('sendContribution');
                    setShowModalRealizeAction(true);
                }}
                label="Enviar relatório"
            />

            <ActionButton
                onClick={() => {}}
                label="Sacar tokens"
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