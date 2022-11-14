import React from "react";
import Webcam from "react-webcam";
import * as Dialog from '@radix-ui/react-dialog';
import './webcam.css'

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

export function WebcamComponent({onTake}){
    return (
        <Dialog.Portal className='webcam__portal'>
            <Dialog.Overlay className='webcam__overlay'/>
            <Dialog.Content className='webcam__content'>
                <Webcam
                    audio={false}
                    height={500}
                    screenshotFormat="image/png"
                    width={700}
                    videoConstraints={videoConstraints}
                >
                    {({ getScreenshot }) => (
                    <button
                        onClick={() => {
                            const imageSrc = getScreenshot()
                            onTake(imageSrc)
                        }}
                    >
                        Capture photo
                    </button>
                    )}
                </Webcam>
            </Dialog.Content>
        </Dialog.Portal>
    )
}