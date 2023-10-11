import { NumericFormat } from 'react-number-format';
import { useTranslation } from "react-i18next";
import { useMainContext } from '../hooks/useMainContext';

export function CardImpact({title, type, impact}){
    const {impactPerToken} = useMainContext();
    const {t} = useTranslation();

    return(
        <div className={`flex flex-col border-2 rounded-lg overflow-hidden w-[97%] lg:w-[300px] ${type === 'impactToken' ? 'bg-arvore-2' : 'bg-card-impact'} bg-center`}>
            <div className="flex items-center justify-center h-12 bg-green-900 border-b-2 px-3">
                <p className="font-bold text-white text-center">{t(`${title}`)}</p>
            </div>
            <div className="w-full flex flex-col items-center justify-center h-[300px] bg-black/50 gap-5 px-5">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center justify-center">
                        <img
                            src={require('../assets/co2.png')}
                            alt='carbono'
                            className="w-[50px] object-contain mr-2"
                        />
                        <p className="font-bold text-white text-lg">{t('Carbono')}</p>
                        {type === 'impactToken' && (
                            <>
                            <p className="font-bold text-white text-lg">/</p>
                            <img
                                src={require('../assets/token.png')}
                                alt='carbono'
                                className="w-[20px] object-contain"
                            />
                            </>
                        )}
                    </div>
                    
                    {type === 'impactToken' ? (
                        <p className="font-bold text-white text-xl">{(Number(impactPerToken?.carbon) * 1000).toFixed(2).replace('.',',')} g</p>
                    ) : (
                        <div className="flex items-center gap-1">
                        <NumericFormat 
                            value={(impact?.carbon / 1000).toFixed(0)} 
                            allowLeadingZeros 
                            thousandSeparator="." 
                            decimalSeparator="," 
                            className="font-bold text-white bg-transparent text-xl text-end w-28"
                        />
                        <p className="font-bold text-white text-lg">t</p>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center justify-center">
                        <img
                            src={require('../assets/solo.png')}
                            alt='carbono'
                            className="w-[50px] object-contain mr-2"
                        />
                        <p className="font-bold text-white text-lg">{t('Solo')}</p>
                        {type === 'impactToken' && (
                            <>
                            <p className="font-bold text-white text-lg">/</p>
                            <img
                                src={require('../assets/token.png')}
                                alt='carbono'
                                className="w-[20px] object-contain"
                            />
                            </>
                        )}
                    </div>
                    
                    {type === 'impactToken' ? (
                        <p className="font-bold text-white text-xl">{(Number(impactPerToken?.soil) * 10000).toFixed(2).replace('.',',')} cm²</p>
                    ) : (
                        <div className="flex items-center gap-1">
                        <NumericFormat 
                            value={impact?.solo?.toFixed(0)} 
                            allowLeadingZeros 
                            thousandSeparator="." 
                            decimalSeparator="," 
                            className="font-bold text-white bg-transparent text-xl text-end w-28"
                        />
                        <p className="font-bold text-white text-lg">m²</p>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center justify-center">
                        <img
                            src={require('../assets/bio.png')}
                            alt='carbono'
                            className="w-[50px] object-contain mr-2"
                        />
                        <p className="font-bold text-white text-lg">{t('Bio.')}</p>
                        {type === 'impactToken' && (
                            <>
                            <p className="font-bold text-white text-lg">/</p>
                            <img
                                src={require('../assets/token.png')}
                                alt='carbono'
                                className="w-[20px] object-contain"
                            />
                            </>
                        )}
                    </div>
                    
                    {type === 'impactToken' ? (
                        <p className="font-bold text-white text-xl">{Number(impactPerToken?.bio).toFixed(2).replace('.',',')} uv</p>
                    ) : (
                        <div className="flex items-center gap-1">
                        <NumericFormat 
                            value={impact?.bio?.toFixed(0)} 
                            allowLeadingZeros 
                            thousandSeparator="." 
                            decimalSeparator="," 
                            className="font-bold text-white bg-transparent text-xl text-end w-28"
                        />
                        <p className="font-bold text-white text-lg">uv</p>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center justify-center">
                        <img
                            src={require('../assets/agua.png')}
                            alt='carbono'
                            className="w-[50px] object-contain mr-2"
                        />
                        <p className="font-bold text-white text-lg">{t('Água')}</p>
                        {type === 'impactToken' && (
                            <>
                            <p className="font-bold text-white text-lg">/</p>
                            <img
                                src={require('../assets/token.png')}
                                alt='carbono'
                                className="w-[20px] object-contain"
                            />
                            </>
                        )}
                    </div>
                    
                    {type === 'impactToken' ? (
                        <p className="font-bold text-white text-xl">{(Number(impactPerToken?.water) * 1000).toFixed(2).replace('.',',')} L</p>
                    ) : (
                        <div className="flex items-center gap-1">
                        <NumericFormat 
                            value={impact?.agua?.toFixed(0)} 
                            allowLeadingZeros 
                            thousandSeparator="." 
                            decimalSeparator="," 
                            className="font-bold text-white bg-transparent text-xl text-end w-28"
                        />
                        <p className="font-bold text-white text-lg">m³</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}