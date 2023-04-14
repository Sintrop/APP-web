import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

//components
import CreateCategory from '../IsaPageComponents/CreateCategory';
import ItemsListISA from '../IsaPageComponents/ItemsListISA';
import Loading from '../Loading';
import {IndiceItem} from '../IndiceItem';

//services
import {GetCategories} from '../../services/isaService';

export default function ISA({user, walletAddress, setTab}){
    const {t} = useTranslation();
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
        const response = await GetCategories();
        setCategories(response);
        setLoading(false);
    }

    return(
        <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-10 overflow-auto'>
            <h1 className='font-bold text-2xl text-white'>{t('Sustainable Agriculture Index')}</h1>
            
            {categories.length === 0 ? (
                <h1>{t('No category registered')}</h1>
            ) : (              
                <div className="mt-10 h-[90vh] lg:overflow-auto lg:pb-20">  
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