import React from 'react';
import { useTranslation } from 'react-i18next';
import {RiCloseCircleLine} from 'react-icons/ri';
export function ModalWelcomePlatform({close}){
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
                    <div className="flex flex-col w-full items-center lg:gap-5 justify-center lg:flex-row ">
                        <img
                            className='w-[150px] h-[150px] object-contain'
                            src={require('../assets/platform.png')}
                        />
                        <h1 className='font-bold text-white text-lg lg:text-2xl text-center lg:text-start'>{t('Welcome to the Decentralized Nature Regeneration System')}</h1>
                    </div>
                    <h2 className='text-white text-sm lg:text-base mt-2 lg:mt-5 text-center'>{t("Our goal is to create an ecosystem of transparency and reward for the environmental service of ecosystem regeneration. The application is in the testing phase, so any feedback or suggestion for improvement is important, we leave an icon so you can leave yours. If you have any questions, click on our wizard or get in touch")}.</h2>
                </div>

                <div/>
            </div>
        </div>
    )
}