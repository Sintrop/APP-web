import React, {useEffect, useState} from 'react';
import '../../IsaPageComponents/CreateCategory/createCategory.css';
import './modalSeeResult.css';
import * as Dialog from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
//components
import Loading from '../../Loading';
import ItemCategoryResult from '../ItemCategoryResult';

//services
import {GetIsa} from '../../../services/manageInspectionsService';

export default function ModalSeeResult({close, inspectionData}){
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [isas, setIsas] = useState([]);

    useEffect(() => {
        getIsa();
    },[]);

    async function getIsa(){
        setLoading(true);
        const response = await GetIsa(inspectionData.id);
        setIsas(response);
        setLoading(false);
    };

    return(
        <Dialog.Portal className='modal-see-result__portal'>
            <Dialog.Overlay className='modal-see-result__overlay'/>
            <Dialog.Content className='modal-see-result__content'>
                <Dialog.Title className='modal-see-result__title'>
                    {t('Result Inspection')}
                </Dialog.Title>
                        <div className='area_data_inspection'>
                            {isas.map(item => (
                                <div className='card_data_inspection' key={item.id}>
                                    <ItemCategoryResult data={item} isas={isas}/>
                                </div>
                            ))}
                        </div>
                        
                        <div className='modal-see-result__area-btn'>
                            <Dialog.Close>
                                {t('Close')}
                            </Dialog.Close>
                        </div>
            </Dialog.Content>
            {loading && (
                <Loading/>
            )}
        </Dialog.Portal>
    )
}