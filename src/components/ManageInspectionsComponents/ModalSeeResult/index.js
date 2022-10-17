import React, {useEffect, useState} from 'react';
import '../../IsaPageComponents/CreateCategory/createCategory.css';
import './modalSeeResult.css';
//components
import Loading from '../../Loading';
import ItemCategoryResult from '../ItemCategoryResult';

//services
import {GetIsa} from '../../../services/manageInspectionsService';

export default function ModalSeeResult({close, inspectionData}){
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
        <div className="container-create-category">
            <div className="card-create-category">
                <div className="header-create-category">
                    <p className='tit-categories-isa'>Inspection Result</p>
                    <button
                        className="btn-close-create-category"
                        onClick={() => close()}
                    >
                        X
                    </button>
                </div>
                <div className='area_data_inspection'>
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
                    <div className='area_categories_result'>
                        {isas.map((item) => {
                            return(
                                <div className='card_data_inspection' key={item.categoryId}>
                                    <ItemCategoryResult data={item} isas={isas}/>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {loading && (
                <Loading/>
            )}
        </div>
    )
}