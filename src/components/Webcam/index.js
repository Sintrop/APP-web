import React, {useState, useEffect, useRef} from "react";
import Webcam from "react-webcam";
import * as Dialog from '@radix-ui/react-dialog';
import './webcam.css';
import { useTranslation } from "react-i18next";

const videoConstraints = {
    width: 800,
    height: 600,
    facingMode: "user"
};

export function WebcamComponent({onTake}){
    const {t} = useTranslation();
    const [imageSrc, setImageSrc] = useState('');
    const [haveWebcam, setHaveWebcam] = useState(false);
    const [loading, setLoading] = useState(false);

    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const [hasPhoto, setHasPhoto] = useState(false);

    useEffect(() => {
        checkWebcam();
    },[]);

    useEffect(() => {
        //getVideo();
    },[videoRef])

    const getVideo = () => {
        navigator.mediaDevices
            .getUserMedia({
                video: {width: 1920, height: 1080}
            })
            .then(stream => {
                let video = videoRef.current;
                video.srcObject = stream;
                video.play();
            })
            .catch(err => {
                console.log(err);
            })
    }

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
        <Webcam
            className="w-full h-[200px] z-50"
            audio={false}
            screenshotFormat="image/png"
            videoConstraints={videoConstraints}
        >
            {({ getScreenshot }) => (
            <>
                {imageSrc === '' && (
                    <div className="flex flex-col items-center w-full">
                    <button
                        style={{marginTop: 15}}
                        onClick={() => {
                            const imageSrc = getScreenshot();
                            onTake(imageSrc);
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
        
        
    )

}