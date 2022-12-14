import React, {useState} from "react";
import Webcam from "react-webcam";
import * as Dialog from '@radix-ui/react-dialog';
import './webcam.css'

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

export function WebcamComponent({onTake}){
    const [imageSrc, setImageSrc] = useState('');

    return (
        <Dialog.Portal className='webcam__portal'>
            <Dialog.Overlay className='webcam__overlay'/>
            <Dialog.Content className='webcam__content'>
                {imageSrc === '' ? (
                    <Webcam
                        audio={false}
                        height={500}
                        screenshotFormat="image/png"
                        width={700}
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
                                    Capture photo
                                </button>
                            )}
                            </>
                        )}
                    </Webcam>
                ) : (
                    <img 
                        src={imageSrc} 
                        alt="Captured photo"
                        style={{width: 700, height: 500}}
                    />
                )}
                {imageSrc !== '' && (
                    <div className="webcam__area-confirm">
                        <button
                            onClick={() => setImageSrc('')}
                        >Take another</button>

                        <button
                            onClick={() => {
                                onTake(imageSrc)
                            }}
                        >Confirm</button>
                    </div>
                )}
            </Dialog.Content>
        </Dialog.Portal>
    )
}