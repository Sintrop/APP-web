import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import * as Dialog from '@radix-ui/react-dialog';

export function ModalLoadingCam({loadingCam, haveWebcam, close}){
    const {t} = useTranslation();

    useEffect(() => {
        if(!loadingCam){
            if(haveWebcam){
                close()
            }
        }
    }, [loadingCam]);

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-center p-3 w-[250px] h-[250px] bg-green-950 rounded-md m-auto inset-0 border-2'>
                {loadingCam ? (
                    <p className='text-white'>{t('Loading camera')}</p>
                ) : (
                    <>
                    {!haveWebcam && (
                        <div className="text-white text-center">
                            <h1>{t('Your device does not have a camera, or has been denied permission to access it')}</h1>
                                <button
                                    className="mt-3 px-5 py-2 rounded-md text-white font-bold bg-[#ff9900]"
                                    onClick={() => {
                                        navigator.mediaDevices.getUserMedia({video: true})
                                        .then(() => {
                                            close();
                                        })
                                    }}
                                >
                                    Requisitar Permissão Novamente
                            </button>
                        </div>
                    )}
                    </>
                )}
            </Dialog.Content>
        </Dialog.Portal>
    )
}