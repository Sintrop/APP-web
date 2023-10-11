import React, {useState, useEffect} from "react";
import Webcam from "react-webcam";
import './webcam.css';
import { useTranslation } from "react-i18next";

const videoConstraints = {
    width: 800,
    height: 600,
    facingMode: "user"
};

export function WebcamComponent({onTake, close}){
    const {t} = useTranslation();
    const [imageSrc, setImageSrc] = useState('');
    const [haveWebcam, setHaveWebcam] = useState(false);
    const [loading, setLoading] = useState(false);
    const [havePhoto, setHavePhoto] = useState(false);
    const [photoUri, setPhotoUri] = useState('');

    useEffect(() => {
        checkWebcam();
    },[]);

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

    if(!loading && !haveWebcam) {
        return(
            <div 
                className="flex fixed top-0 left-0 w-screen h-screen items-center justify-center bg-black/90 z-10 m-auto"
            >
                <div className="flex flex-col items-center w-full justify-center p-5 lg:w-[500px] h-[500px] rounded-lg bg-white">
                    <div className="flex flex-col absolute w-[280px] lg:w-[400px] z-20">
                        <p className="text-black text-center font-bold">{t('Não conseguimos acessar sua câmera. Veja os possíveis motivos abaixo:')}</p>
                        <p className="text-black text-center mt-5">- {t('Seu dispositivo não possui câmera')};</p>
                        <p className="text-black text-center">- {t('Outro aplicativo está utilizando a câmera no momento')};</p>
                        <p className="text-black text-center">- {t('Você não autorizou a permissão da câmera para nosso site')}.</p>

                        <button
                            onClick={checkWebcam}
                            className="px-3 py-2 bg-[#ff9900] rounded-lg font-bold text-white mt-5"
                        >
                            {t('Solicitar permissão novamente')}
                        </button>

                        <p className="text-black text-center mt-5">{t('Caso o botão acima não funcione, você precisará permitir o uso da câmera pelas configurações do seu navegador')};</p>
                    </div>
                </div>
            </div>
        )
    }

    if(photoUri !== ''){
        return (
            <div 
                className="flex fixed top-0 left-0 w-screen h-screen items-center justify-center bg-black/90 z-10 m-auto"
            >
                <div className="flex flex-col items-center w-full justify-between p-5 lg:w-[500px] h-[500px] rounded-lg">
                    <img
                        src={photoUri}
                        className="w-full object-contain border-4"
                    />

                    <div className="flex items-center justify-between w-full p-3 rounded-lg bg-white">
                        <button
                            onClick={() => setPhotoUri('')}
                            className='px-5 h-10 border-2 border-[#C66828] font-bold text-[#c66828] rounded-md'
                        >
                            {t('Take another')}
                        </button>
                        <button
                            onClick={() => onTake(photoUri)}
                            className='px-5 h-10 bg-[#C66828] font-bold text-white rounded-md'
                        >
                            {t('Confirm')}
                        </button>
                    </div>
                </div>
            </div>
        );    
    }

    return (
        <div 
            className="flex fixed top-0 left-0 w-screen h-screen items-center justify-center bg-black/90 z-10 m-auto"
        >
            <div className="flex flex-col items-center w-full justify-between p-5 lg:w-[500px] h-[500px] rounded-lg">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="bg-white px-3 py-2 rounded-lg">{t('Loading camera')}</p>
                    </div>
                ) : (
                    <Webcam
                        className="w-full z-50 border-4 max-h-[400px]"
                        audio={false}
                        screenshotFormat="image/png"
                        videoConstraints={videoConstraints}
                    >
                        {({ getScreenshot }) => (
                        <>
                            {imageSrc === '' && haveWebcam && (
                                <div className="flex items-center justify-between w-full p-3 rounded-lg bg-white">
                                    <button
                                        onClick={close}
                                        className='px-5 h-10 border-2 border-[#C66828] font-bold text-[#c66828] rounded-md'
                                    >
                                        {t('Cancel')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            const imageSrc = getScreenshot();
                                            setPhotoUri(imageSrc);
                                        }}
                                        className='px-5 h-10 bg-[#C66828] font-bold text-white rounded-md'
                                    >
                                        {t('Capture photo')}
                                    </button>
                                </div>
                            )}
                        </>
                        )}
                    </Webcam>
                )}

            </div>
        </div>
        
    )

}