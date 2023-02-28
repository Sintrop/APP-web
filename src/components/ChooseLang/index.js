import React from 'react';
import {useMainContext} from '../../hooks/useMainContext';
import IconBR from '../../assets/img/icon-br.png';
import IconUS from '../../assets/img/icon-us.png';

export function ChooseLang(){
    const {language, chooseLanguage} = useMainContext();
    return(
        <button
            style={{display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: 'transparent', border: 0}}
            onClick={() => {
                if(language === 'en-us'){
                    chooseLanguage('pt-BR');
                }else{
                    chooseLanguage('en-us');
                }
            }}
        >
            {language === 'en-us' && (
                <img
                    style={{width: 40, height: 30, objectFit: 'cover'}}
                    src={IconBR}
                />
            )}
            {language === 'pt-BR' && (
                <img
                    style={{width: 40, height: 30, objectFit: 'cover'}}
                    src={IconUS}
                />
            )}
        </button>
    )
}