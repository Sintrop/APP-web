import React from "react";
import { useMainContext } from "../../../../hooks/useMainContext";
import { useTranslation } from "react-i18next";

export function ModalLogout({close}){
    const {t} = useTranslation();
    const {logout} = useMainContext();

    return(
        <div className='flex justify-center items-center inset-0'>
            <div className='bg-[rgba(0,0,0,0.6)] fixed inset-0' onClick={close} />
            <div className='absolute flex flex-col items-center justify-center p-3 lg:w-[300px] lg:h-[200px] bg-[#03364D] rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 z-50'>
                <p className="text-center text-white font-semibold">{t('desejaDesconectar')}</p>

                <div className="mt-5 flex flex-col gap-3">
                    <button
                        onClick={() => {
                            logout();
                            close();
                        }}
                        className="text-white font-semibold text-center py-2 w-full bg-[#ff0000] rounded-md px-10"
                    >
                        {t('desconectar')}
                    </button>

                    <button
                        onClick={close}
                        className="text-white font-semibold text-center"
                    >
                        {t('cancelar')}
                    </button>
                </div>
            </div>
        </div>
    )
}