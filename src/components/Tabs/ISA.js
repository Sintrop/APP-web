import React, {useState, useEffect} from 'react';
import './isa.css';
import {useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

//components
import CreateCategory from '../IsaPageComponents/CreateCategory';
import ItemsListISA from '../IsaPageComponents/ItemsListISA';
import Loading from '../Loading';

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
        <div className='container-isa-page'>
            <div className='header-isa'>
                <h1>{t('Sustainable Agriculture Index')}</h1>
                <div className='area-btn-header-isa-page'>
                    {user == 3 && (
                        <button
                            className='btn-new-category-isa'
                            onClick={() => setIsCreateCategory(true)}
                        >
                            {t('Create New Category')}
                        </button>
                    )}
                    <button
                        className='btn-load-categories-isa'
                        onClick={() => getCategories()}
                    >
                        {t('Load Categories')}
                    </button>
                </div>
            </div>
            
            {categories.length === 0 ? (
                <h1>{t('No category registered')}</h1>
            ) : (                
                <table>
                    <thead>
                        <th className='th-info-isa'>{t('Info')}</th>
                        <th id='createdByIsaTable'>{t('Created By')}</th>
                        <th id='categories-isa-table'>{t('Name')}</th>
                        <th className='description-isa-table'>{t('Description')}</th>
                        <th id='votes-isa-table'>{t('Number Of Votes')}</th>
                        <th id='config-isa-table'>{t('Actions')}</th>
                    </thead>
                    <tbody>
                        {categories.map(item => {
                            return(
                                <ItemsListISA 
                                    data={item} 
                                    key={item.id} 
                                    walletAddress={walletAddress}
                                    reloadCategories={() => getCategories()}
                                    setTab={(tab, wallet) => setTab(tab, wallet)}
                                />
                            )
                        })}
                    </tbody>
                </table>                
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