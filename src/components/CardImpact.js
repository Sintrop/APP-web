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
                        <p className="font-bold text-white text-xl">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(impactPerToken?.carbon * 1000)} g</p>
                    ) : (
                        <p className="font-bold text-white text-lg">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 0}).format(impact?.carbon / 1000)} t</p>
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
                        <p className="font-bold text-white text-xl">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(impactPerToken?.soil * 10000)} cm²</p>
                    ) : (
                        <p className="font-bold text-white text-lg">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 0}).format(impact?.solo)} m²</p>
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
                        <p className="font-bold text-white text-xl">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 5}).format(impactPerToken?.bio)} uv</p>
                    ) : (
                        <p className="font-bold text-white text-lg">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 0}).format(impact?.bio)} uv</p>
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
                        <p className="font-bold text-white text-xl">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 3}).format(impactPerToken?.water * 1000)} L</p>
                    ) : (
                        <p className="font-bold text-white text-lg">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 0}).format(impact?.agua)} m³</p>
                    )}
                </div>
            </div>
        </div>
    )
}