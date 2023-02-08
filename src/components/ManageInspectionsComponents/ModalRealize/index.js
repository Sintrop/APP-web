import React, {useEffect, useState} from "react";
import '../../IsaPageComponents/CreateCategory/createCategory.css';
import './modalRealize.css';
import * as Dialog from '@radix-ui/react-dialog';

//components
import Loading from '../../Loading';
import CardCategoryRealizeInspection from "../CardCategoryRealizeInspection";
import { LoadingTransaction } from "../../LoadingTransaction";

//services
import {GetCategories} from '../../../services/isaService';
import {RealizeInspection} from '../../../services/manageInspectionsService';
import { save } from '../../../config/infura'
export default function ModalRealize({close, inspectionID, walletAddress, reloadInspections}){
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isas, setIsas] = useState([]);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [loadingTransaction, setLoadingTransaction] = useState(false);

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
        const isasSave  = await Promise.all(
            isas.map(async (item) => {
                let object = {}
                const path = await save(item.proofPhoto)
                object = {
                    categoryId: item.categoryId,
                    isaIndex: item.isaIndex,
                    report: item.report,
                    proofPhoto: path
                };
                
                return object;
            })
        ) 
        setModalTransaction(true);
        setLoadingTransaction(true);
        RealizeInspection(inspectionID, isasSave, walletAddress)
        .then(res => {
            setLogTransaction({
                type: res.type,
                message: res.message,
                hash: res.hashTransaction
            })
            setLoadingTransaction(false);
        })
        .catch(err => {
            setLoadingTransaction(false);
            const message = String(err.message);
            if(message.includes("Can't accept yet")){
                setLogTransaction({
                    type: 'error',
                    message: "Can't accept yet",
                    hash: ''
                })
                return;
            }
            if(message.includes("Inspection Expired")){
                setLogTransaction({
                    type: 'error',
                    message: 'Inspection Expired!',
                    hash: ''
                })
                return;
            }
            if(message.includes("Please register as activist")){
                setLogTransaction({
                    type: 'error',
                    message: 'Please register as activist!',
                    hash: ''
                })
                return;
            }
            if(message.includes("This inspection don't exists")){
                setLogTransaction({
                    type: 'error',
                    message: "This inspection don't exists!",
                    hash: ''
                })
                return;
            }
            if(message.includes("Accept this inspection before")){
                setLogTransaction({
                    type: 'error',
                    message: "Accept this inspection before!",
                    hash: ''
                })
                return;
            }
            if(message.includes("You not accepted this inspection")){
                setLogTransaction({
                    type: 'error',
                    message: "You not accepted this inspection!",
                    hash: ''
                })
                return;
            }
            setLogTransaction({
                type: 'error',
                message: 'Something went wrong with the transaction, please try again!',
                hash: ''
            })
        })
        
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

            <Dialog.Root 
                open={modalTransaction} 
                onOpenChange={(open) => {
                    if(!loadingTransaction){
                        setModalTransaction(open);
                        reloadInspections();
                        close();
                    }
                }}
            >
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                />
            </Dialog.Root>
        </div>
    )
}