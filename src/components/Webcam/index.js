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
        <Dialog.Portal className='webcam__portal'>
            <Dialog.Overlay className='webcam__overlay'/>
            <Dialog.Content className='webcam__content'>
                {!haveWebcam ? (
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center'}}>
                        {loading ? (
                            <h1>{t('Loading camera')}</h1>
                        ) : (
                            <h1>{t('Your device does not have a camera, or has been denied permission to access it')}</h1>
                        )}
                    </div>
                ) : (
                    <>
                        {imageSrc === '' || !check ? (
                            <Webcam
                                className="webcam"
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
                                style={{width: 600, height: 450}}
                            />
                        )}
                        {imageSrc !== '' && (
                            <div className="webcam__area-confirm">
                                <button
                                    onClick={() => setImageSrc('')}
                                >{t('Take another')}</button>
        
                                <button
                                    onClick={() => {
                                        onTake(imageSrc)
                                    }}
                                >{t('Confirm')}</button>
                            </div>
                        )}
                    </>
                )}
            </Dialog.Content>
        </Dialog.Portal>
    )
}