import React from 'react';
import {PuffLoader,FadeLoader,SkewLoader,ClockLoader, PropagateLoader,BeatLoader,GridLoader,ClipLoader,PacmanLoader, CircleLoader, RotateLoader, DotLoader, SyncLoader, BounceLoader,ClimbingBoxLoader, SquareLoader, HashLoader} from "react-spinners";
import { useTranslation } from 'react-i18next';

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

export default function Loader({type, color, size, noText}){
    const {t} = useTranslation();
    return(
        <div className="flex flex-col items-center justify-center gap-2">
            {type === 'hash' && (
                <>
                    <HashLoader
                        color={color}
                        loading={true}
                        cssOverride={override}
                        size={100}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                    {!noText && (
                        <p className="font-bold text-white">{t('Loading Data')}</p>
                    )}
                </>
            )}

            {type === 'spinning' && (
                <>
                    <FadeLoader
                        color={color}
                        loading={true}
                        cssOverride={override}
                        size={25}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </>
            )}
        </div>
    )
}