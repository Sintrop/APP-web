import React from 'react';
import { useTranslation } from 'react-i18next';

export function ModalSuccess(){
    const {t} = useTranslation();
    return(
        <div 
            className="flex fixed top-0 left-0 w-screen h-screen items-center justify-center bg-black/90 z-10 m-auto"
        >
            <div className="flex flex-col items-center justify-center w-full p-5 lg:w-[500px] h-[500px] bg-white rounded-lg">
                <h1 className='font-bold text-black text-3xl'>{t('Congratulations')}!!!</h1>
                <h2 className='font-bold text-black mt-8 text-center'>{t('Você acaba de dar o primeiro passo no seu cadastro! Mas ainda não finalizamos, veja os próximos passos abaixo:')}</h2>
                <h2 className='text-black text-center mt-2'>{t('Agora volte para plataforma, e toque no botão finalizar cadastro (Veja na imagem abaixo), depois conclua a transação no metamask.')}</h2>
            </div>
        </div>
    )
}