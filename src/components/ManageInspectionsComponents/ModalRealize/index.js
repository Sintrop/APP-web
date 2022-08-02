import React, {useEffect, useState} from "react";
import '../../IsaPageComponents/CreateCategory/createCategory.css';
import './modalRealize.css';

//components
import Loading from '../../Loading';
import CardCategoryRealizeInspection from "../CardCategoryRealizeInspection";

//services
import {GetCategories} from '../../../services/isaService';
import {RealizeInspection} from '../../../services/manageInspectionsService';

export default function ModalRealize({close, inspectionID, walletAddress, reloadInspections}){
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isas, setIsas] = useState([]);

    useEffect(() => {
        getCategories();
    }, [])

    async function getCategories(){
        setLoading(true);
        const response = await GetCategories();
        setCategories(response);
        setLoading(false);
    }

    function validates(){
        if(isas == []){
            alert('Select result options for each category!');
        }else if(isas.length != categories.length){
            alert('Select result options for each category!');
        }else{
            finishInspection();
        }
    }

    async function finishInspection(){
        setLoading(true);
        await RealizeInspection(inspectionID, isas, walletAddress);
        setLoading(false);
        reloadInspections();
        close();
    }

    function attResults(id, isaIndex, report, proofPhoto){
        var object = {
            categoryId: id,
            isaIndex,
            report,
            proofPhoto
        };
        var newArray = isas.filter(item => item.categoryId != id);
        let array = newArray;
        array.push(object);
        setIsas(array);
    }

    return(
        <div className="container-create-category">
            <div className="card-create-category">
                <div className="header-create-category">
                    <p className='tit-categories-isa'>Scoring the Categories</p>
                    <button
                        className="btn-close-create-category"
                        onClick={() => close()}
                    >
                        X
                    </button>
                </div>
                <div className="container_realize_inspection">
                    {categories.map(item => {
                        return(
                            <CardCategoryRealizeInspection 
                                data={item}
                                pushResult={(id, isaIndex, report, proofPhoto) => attResults(id, isaIndex, report, proofPhoto)}
                            />
                        )
                    })}
                </div>
                <div className="footer_realize_inspection">
                    <button
                        className="btn-finish-inspection"
                        onClick={() => validates()}
                    >
                        Finish inspection
                    </button>
                </div>

            </div>

            {loading && (
                <Loading/>
            )}
        </div>
    )
}