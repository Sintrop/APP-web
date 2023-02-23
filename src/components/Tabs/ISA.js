import React, {useState, useEffect} from 'react';
import './isa.css';
import {useParams} from 'react-router-dom';

//components
import CreateCategory from '../IsaPageComponents/CreateCategory';
import ItemsListISA from '../IsaPageComponents/ItemsListISA';
import Loading from '../Loading';

//services
import {GetCategories} from '../../services/isaService';

export default function ISA({user, walletAddress, setTab}){
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
                <h1>Sustainable Agriculture Index</h1>
                <div className='area-btn-header-isa-page'>
                    {user == 3 && (
                        <button
                            className='btn-new-category-isa'
                            onClick={() => setIsCreateCategory(true)}
                        >
                            Create New Category
                        </button>
                    )}
                    <button
                        className='btn-load-categories-isa'
                        onClick={() => getCategories()}
                    >
                        Load Categories
                    </button>
                </div>
            </div>
            
            <div style={{overflowY: 'auto', display: 'flex', flexDirection: 'column', height: '70vh'}}>
            {categories.length === 0 ? (
                <h1>No category registered</h1>
            ) : (                
                <table>
                    <thead>
                        <th className='th-info-isa'>Info</th>
                        <th id='createdByIsaTable'>Created By</th>
                        <th id='categories-isa-table'>Name</th>
                        <th className='description-isa-table'>Description</th>
                        <th id='votes-isa-table'>Number Of Votes</th>
                        <th id='config-isa-table'>Actions</th>
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
            </div>
           
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