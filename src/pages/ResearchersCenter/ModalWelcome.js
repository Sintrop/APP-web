import React from 'react';
import { useTranslation } from 'react-i18next';
import {RiCloseCircleLine} from 'react-icons/ri';
export function ModalWelcome({close}){
    const {t} = useTranslation();
    return(
        <div 
            className="flex fixed top-0 left-0 w-screen h-screen items-center justify-center bg-black/90 z-10 m-auto"
        >
            <div className="flex flex-col items-center justify-between w-full p-5 lg:w-[500px] h-[500px] bg-[#222831] rounded-lg">
                <div className="flex items-center justify-between w-full">
                    <div/>
                    <button onClick={close}>
                        <RiCloseCircleLine color='white' size={30}/>
                    </button>
                </div>

                <div className="flex flex-col">
                    <div className="flex flex-col w-full items-center gap-5 justify-center lg:flex-row ">
                        <img
                            className='w-[150px] h-[150px] object-contain'
                            src={require('../../assets/icon-pesquisas2.png')}
                        />
                        <h1 className='font-bold text-white text-3xl'>{t('Welcome to the research center')}</h1>
                    </div>
                    <h2 className='text-white mt-8 text-center'>{t("Space destined for research and development of the System's evaluation methods. Our goal is to improve and make measuring the ecosystem impact of producers even better. To participate, simply post a survey. It may contain a study of its own origin, a suggestion for improvement in existing methods or a proposal for the creation of a new method. Each published research has 1 point, and the distribution of Regeneration Credits is done according to the score obtained")}.</h2>
                </div>

                <div/>
            </div>
        </div>
    )
}