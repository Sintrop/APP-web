import React, {useState, useEffect} from "react";
import Webcam from "react-webcam";
import * as Dialog from '@radix-ui/react-dialog';
import './webcam.css';
import { useTranslation } from "react-i18next";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

export function WebcamComponent({onTake, check}){
    const {t} = useTranslation();
    const [imageSrc, setImageSrc] = useState('');
    const [haveWebcam, setHaveWebcam] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(check){
            checkWebcam();
        }
    },[check])

    function checkWebcam(){
        setLoading(true);
        navigator.mediaDevices.getUserMedia({video: true})
        .then(() => {
            setLoading(false);
            setHaveWebcam(true);
        })
        .catch(err => {
            setLoading(false);
            setHaveWebcam(false);
        })
    }

    return (
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='fixed flex flex-col items-center justify-between lg:w-[600px] lg:h-[520px] p-3 bg-white rounded-md lg:my-auto lg:mx-auto mx-2 my-2 inset-0'>
                {!haveWebcam ? (
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center'}}>
                        {loading ? (
                            <h1>{t('Loading camera')}</h1>
                        ) : (
                            <div>
                                <h1>{t('Your device does not have a camera, or has been denied permission to access it')}</h1>
                                <button
                                    className="mt-3 px-5 py-2 rounded-md text-white font-bold bg-[#ff9900]"
                                    onClick={() => {
                                        navigator.mediaDevices.getUserMedia({video: true})
                                        .then(() => {
                                            setHaveWebcam(true)
                                        })
                                    }}
                                >
                                    Requisitar Permissão Novamente
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {imageSrc === '' || !check ? (
                            <Webcam
                                className="w-[600px] h-[450px]"
                                audio={false}
                                screenshotFormat="image/png"
                                videoConstraints={videoConstraints}
                            >
                                {({ getScreenshot }) => (
                                    <>
                                    {imageSrc === '' && (
                                        <button
                                            style={{marginTop: 15}}
                                            onClick={() => {
                                                const imageSrc = getScreenshot()
                                                setImageSrc(imageSrc)
                                            }}
                                            className='px-5 h-10 bg-[#C66828] font-bold text-white rounded-md'
                                        >
                                            {t('Capture photo')}
                                        </button>
                                    )}
                                    </>
                                )}
                            </Webcam>
                        ) : (
                            <img 
                                src={imageSrc} 
                                alt="Captured photo"
                                className="lg:w-[600px] h-[450px] object-contain lg:object-cover"
                            />
                        )}
                        {imageSrc !== '' && (
                            <div className="w-full flex justify-center gap-3">
                                <button
                                    onClick={() => setImageSrc('')}
                                    className='px-5 h-10 bg-[#C66828] font-bold text-white rounded-md'
                                >{t('Take another')}</button>
        
                                <button
                                    onClick={() => {
                                        onTake(imageSrc)
                                    }}
                                    className='px-5 h-10 bg-[#C66828] font-bold text-white rounded-md'
                                >{t('Confirm')}</button>
                            </div>
                        )}
                    </>
                )}
            </Dialog.Content>
        </Dialog.Portal>
    )
}