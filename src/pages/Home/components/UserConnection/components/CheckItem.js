import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useMainContext } from "../../../../../hooks/useMainContext";
import { api } from "../../../../../services/api";

export function CheckItem({check, title, type, handleShowSignUp}){
    const {userData} = useMainContext();
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    const [showHideBtn, setShowHideBtn] = useState(false);
    

    useEffect(() => {
        if(type === 'application'){
            if(userData.id === 'anonimous'){
                setShowHideBtn(true);
                setOpen(true);
            }
        }

        if(type === 'invite'){
            setShowHideBtn(true);
            if(check){
                setOpen(false);
            }else{
                setOpen(true);
            }
        }
    }, [check]);

    

    function toggleOpen(){
        setOpen(oldValue => !oldValue)
    }

    return(
        <div className="flex flex-col bg-[#052E16] rounded-md p-1 mb-1 w-full">
            <div className="w-full h-7 flex items-center gap-2 relative">
                <div className="h-full w-5 bg-container-primary rounded-md flex items-center justify-center">
                    {check && (
                        <FaCheck size={15} color='#18850B'/>
                    )}
                </div>

                <p className="text-white text-xs">{t(title)}</p>

                {showHideBtn && (
                    <button 
                        className="absolute right-1"
                        onClick={toggleOpen}
                    >
                        {open ? (
                            <FaChevronUp color='white' size={15}/>
                        ) : (
                            <FaChevronDown color='white' size={15}/>
                        )}
                    </button>
                )}
            </div>

            {open && (
                <div className="flex flex-col mt-2">
                    {type === 'apllication' && (
                        <>
                            <p className="text-white text-center text-xs">
                                Vamos precisar de alguns dados seus, mas é bem simples
                            </p>

                            <button 
                                className="w-full h-10 rounded-md mt-5 text-white font-bold text-xs bg-blue-primary"
                                onClick={handleShowSignUp}
                            >
                                Quero me candidatar
                            </button>
                        </>
                    )}

                    {type === 'invite' && (
                        <>
                            <p className="text-white text-center text-xs">
                                {check ? 'Você recebeu um convite de: ' : 'Você precisa receber um convite para efetivar seu cadastro'}
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}