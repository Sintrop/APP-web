import React, {useState, useEffect} from 'react';
import { useTranslation } from 'react-i18next';

export function ModalPermissions({close}){
    const {t} = useTranslation();
    const [geoLocation, setGeolocation] = useState('');

    useEffect(() => {
        if(geoLocation !== ''){
            close(geoLocation)
        }
    },[geoLocation]);

    function getLocale(){
        navigator.geolocation.getCurrentPosition(res => {
            const data = {
                lat: res.coords.latitude,
                lng: res.coords.longitude
            }
            setGeolocation(JSON.stringify(data));
        })
    }

    return(
        <div 
            className="flex fixed top-0 left-0 w-screen h-screen items-center justify-center bg-black/90 z-10 m-auto"
        >
            <div className="flex flex-col items-center justify-center w-full p-5 lg:w-[500px] h-[500px] bg-white rounded-lg">
                <h1 className='font-bold text-black text-xl text-center'>{t('Precisamos de algumas permissões para continuar')}</h1>
                <h2 className='font-bold text-black mt-8 text-center mb-3'>{t('Para efetuar o cadastro nessecitamos que você permita a utilização da sua localização, para que possamos obter sua localização')}</h2>
                
                {geoLocation === '' ? (
                    <button
                        onClick={getLocale}
                        className='px-3 py-2 font-bold text-white rounded-lg bg-[#ff9900]'
                    >
                        {t('Permitir localização')}
                    </button>
                ) : (
                    <p className="font-bold text-green-600 text-xl">{t('Localização permitida')}</p>
                )}
            </div>
        </div>
    )
}