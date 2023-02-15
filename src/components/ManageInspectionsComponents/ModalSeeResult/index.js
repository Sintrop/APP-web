import React, {useEffect, useState} from 'react';
import '../../IsaPageComponents/CreateCategory/createCategory.css';
import './modalSeeResult.css';
import * as Dialog from '@radix-ui/react-dialog';
//components
import Loading from '../../Loading';
import ItemCategoryResult from '../ItemCategoryResult';

//services
import {GetIsa} from '../../../services/manageInspectionsService';

export default function ModalSeeResult({close, inspectionData}){
    const [loading, setLoading] = useState(false);
    const [isas, setIsas] = useState([]);
    const [step, setStep] = useState(1);

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
                    Result inspection
                </Dialog.Title>
                        <div className='area_data_inspection'>
                            {step === 1 && (
                                <>
                                <div className='card_data_inspection'>
                                    <h3 className='title_card_data_inspection'>Produccer wallet</h3>
                                    <p className='description_card_data_inspection'>{inspectionData.createdBy}</p>
                                    <h3 className='title_card_data_inspection'>Activist wallet</h3>
                                    <p className='description_card_data_inspection'>{inspectionData.acceptedBy}</p>
                                </div>
                                <div className='area_data_2_inspection'>
                                    <div className='card_data_inspection created_score'>
                                        <h3 className='title_card_data_inspection'>Created At</h3>
                                        <p className='description_card_data_inspection'>{inspectionData.createdAt}</p>
                                    </div>
                                    <div className='card_data_inspection created_score'>
                                        <h3 className='title_card_data_inspection'>Isa Score</h3>
                                        <p className='description_card_data_inspection'>{inspectionData.isaScore}</p>
                                    </div>
                                </div>
                                </>
                            )}
                            {step > 1 && (
                                <>
                                    {step === 2 && (
                                        <div className='card_data_inspection'>
                                            <ItemCategoryResult data={isas[step - 2]} isas={isas}/>
                                        </div>
                                    )}

                                    {isas.length > 1 && (
                                        <>
                                            {step === 3 && (
                                                <div className='card_data_inspection'>
                                                    <ItemCategoryResult data={isas[step - 2]} isas={isas}/>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {isas.length > 2 && (
                                        <>
                                            {step === 4 && (
                                                <div className='card_data_inspection'>
                                                    <ItemCategoryResult data={isas[step - 2]} isas={isas}/>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {isas.length > 3 && (
                                        <>
                                            {step === 5 && (
                                                <div className='card_data_inspection'>
                                                    <ItemCategoryResult data={isas[step - 2]} isas={isas}/>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {isas.length > 4 && (
                                        <>
                                            {step === 6 && (
                                                <div className='card_data_inspection'>
                                                    <ItemCategoryResult data={isas[step - 2]} isas={isas}/>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {isas.length > 5 && (
                                        <>
                                            {step === 7 && (
                                                <div className='card_data_inspection'>
                                                    <ItemCategoryResult data={isas[step - 2]} isas={isas}/>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {isas.length > 6 && (
                                        <>
                                            {step === 8 && (
                                                <div className='card_data_inspection'>
                                                    <ItemCategoryResult data={isas[step - 2]} isas={isas}/>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {isas.length > 7 && (
                                        <>
                                            {step === 9 && (
                                                <div className='card_data_inspection'>
                                                    <ItemCategoryResult data={isas[step - 2]} isas={isas}/>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {isas.length > 8 && (
                                        <>
                                            {step === 10 && (
                                                <div className='card_data_inspection'>
                                                    <ItemCategoryResult data={isas[step - 2]} isas={isas}/>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {isas.length > 9 && (
                                        <>
                                            {step === 11 && (
                                                <div className='card_data_inspection'>
                                                    <ItemCategoryResult data={isas[step - 2]} isas={isas}/>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {isas.length > 10 && (
                                        <>
                                            {step === 12 && (
                                                <div className='card_data_inspection'>
                                                    <ItemCategoryResult data={isas[step - 2]} isas={isas}/>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {isas.length > 11 && (
                                        <>
                                            {step === 13 && (
                                                <div className='card_data_inspection'>
                                                    <ItemCategoryResult data={isas[step - 2]} isas={isas}/>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {isas.length > 12 && (
                                        <>
                                            {step === 14 && (
                                                <div className='card_data_inspection'>
                                                    <ItemCategoryResult data={isas[step - 2]} isas={isas}/>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {isas.length > 13 && (
                                        <>
                                            {step === 15 && (
                                                <div className='card_data_inspection'>
                                                    <ItemCategoryResult data={isas[step - 2]} isas={isas}/>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {isas.length > 14 && (
                                        <>
                                            {step === 16 && (
                                                <div className='card_data_inspection'>
                                                    <ItemCategoryResult data={isas[step - 2]} isas={isas}/>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        
                        <div className='modal-see-result__area-btn'>
                            <button
                                onClick={() => {
                                    if(step > 1){
                                        setStep(step - 1);
                                    }
                                }}
                            >Previous</button>
                            {step !== isas.length + 1 && (
                                <button
                                    onClick={() => {
                                        if(step <= isas.length){
                                            setStep(step + 1)
                                        }
                                    }}
                                >Next</button>
                            )}
                        </div>
            </Dialog.Content>
                    {loading && (
                        <Loading/>
                    )}
        </Dialog.Portal>
    )
}