import React from "react";
import { useTranslation } from "react-i18next";
import { RevertReasonProps } from "../../../../../../../types/transaction";

interface Props{
    revert_reason: RevertReasonProps
}
export function TransactionErrorDetails({revert_reason}: Props){
    const {t} = useTranslation();
    const errors = revert_reason.parameters;

    return (
        <div className="w-full p-2 border border-red-500 rounded-md relative">
            <div className="text-white flex flex-col gap-1 mt-6">
                {errors && (
                    <>
                        {errors.map(item => (
                            <p
                                key={item.value}
                            >
                                {item.value}
                            </p>
                        ))}
                    </>
                )}
            </div>

            <div className="absolute rounded-tl-md rounded-br-md px-3 py-1 bg-red-500 top-0 left-0">
                <p className="text-white text-sm">{t('motivoDoErro')}</p>
            </div>
        </div>
    )
}