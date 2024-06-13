import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

export const WebcamCapture = ({ captured }) => {
    const webcamRef = useRef(null);
    const [haveWebcam, setHaveWebcam] = useState(false);

    useEffect(() => {
        checkWebcam();
    }, []);

    function checkWebcam() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(() => {
                setHaveWebcam(true);
            })
            .catch(err => {
                setHaveWebcam(false);
            })
    }

    const capture = React.useCallback(
        () => {
            const imageSrc = webcamRef.current.getScreenshot();
            captured(imageSrc);
        },
        [webcamRef]
    );

    if (!haveWebcam) {
        return (
            <div className="flex flex-col items-center my-5">
                <p className="text-white text-center">Sem permissão para acessar a câmera. Dê permissão para o site acessar sua câmera</p>
                <button
                    onClick={checkWebcam}
                    className="text-white font-semibold h-8 px-5 bg-green-700 mt-3 rounded-md"
                >
                    Tentar novamente
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center">
            <div className="flex h-[200px] w-[200px] justify-center">
                <Webcam
                    audio={false}
                    height={720}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={1280}
                    videoConstraints={videoConstraints}
                />
            </div>
            <button
                onClick={capture}
                className="font-bold text-white px-4 h-8 rounded-md bg-green-700 text-sm"
            >
                Capturar
            </button>
        </div>
    );
};