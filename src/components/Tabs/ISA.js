import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Loader from '../Loader';
import { useMainContext } from '../../hooks/useMainContext';

//components
import CreateCategory from '../IsaPageComponents/CreateCategory';
import Loading from '../Loading';
import {IndiceItem} from '../IndiceItem';
import { BackButton } from '../BackButton';

//services
import {GetCategories} from '../../services/isaService';
import { GetCategoriesInfura } from '../../services/methodsGetInfuraApi';

export default function ISA({user, walletAddress, setTab}){
    const {t} = useTranslation();
    const {viewMode} = useMainContext();
    const [categories, setCategories] = useState([]);
    const [isCreateCategory, setIsCreateCategory] = useState(false);
    const [loading, setLoading] = useState(false);
    const {tabActive} = useParams();
    
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])


    useEffect(() => {
        getCategories()
    },[])

    async function getCategories(){
        setLoading(true);
        if(viewMode){
            const response = await GetCategoriesInfura();
            setCategories(response);
        }else{
            const response = await GetCategories();
            setCategories(response);
        }
        setLoading(false);
    }

    if(loading){
        return(
            <div className="flex items-center justify-center bg-green-950 w-full h-screen">
                <Loader
                    color='white'
                    type='hash'
                />
            </div>
        )
    }

    return(
        <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-2 lg:pt-10 overflow-auto'>
            <div className='flex items-center gap-2'>
                <BackButton/>
                <h1 className='font-bold text-lg lg:text-2xl text-white'>{t('Sustainable Agriculture Index')}</h1>
            </div>
            
            {categories.length === 0 ? (
                <h1>{t('No category registered')}</h1>
            ) : (              
                <div className="mt-5 lg:mt-10 h-[64vh] lg:h-[90vh] lg:overflow-auto pb-20">  
                    {categories.map(item => (
                        <IndiceItem
                            key={item.id}
                            data={item}   
                        />
                    ))}
                </div>        
            )}
           
            {isCreateCategory && (
                <CreateCategory 
                    closeCreateCategory={() => setIsCreateCategory(false)}
                    walletAddress={walletAddress}
                    reloadCategories={() => getCategories()}
                />
            )}

            {loading && (
                <Loading/>
            )}
        </div>
    )
}