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
    const [step, setStep] = useState(1);
    const [proofPhoto, setProofPhoto] = useState("");
    const [proofPhotoBase64, setProofPhotoBase64] = useState("");
    const [checkWebcam, setCheckWebcam] = useState(false);
    const [modalWebcam, setModalWebcam] = useState(false);

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
        // const isasSave  = await Promise.all(
        //     isas.map(async (item) => {
        //         let object = {}
        //         const path = await save(item.proofPhoto)
        //         object = {
        //             categoryId: item.categoryId,
        //             isaIndex: item.isaIndex,
        //             report: item.report,
        //             proofPhoto: path
        //         };
                
        //         return object;
        //     })
        // ) 
        setModalTransaction(true);
        setLoadingTransaction(true);
        RealizeInspection(inspectionID, isas, walletAddress)
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

    function handleNextStep(){
        setStep(step + 1);
    }

    function handlePreviousStep(){
        if(step > 1){
            setStep(step - 1);
        }
    }

    return(
        <Dialog.Portal className='modal-realize__portal'>
            <Dialog.Overlay className='modal-realize__overlay'/>
            <Dialog.Content className='modal-realize__content'>
                <Dialog.Title className='modal-realize__title'>
                    Realize inspection
                </Dialog.Title>
                
                <div style={{overflow: 'auto'}}>
                    {step === 1 && (
                        <div className='modal-register__container-content'>
                            <h1 className='modal-register__title'>Proof Photo</h1>

                            {proofPhoto != '' && (
                                <img
                                    src={`data:image/png;base64,${proofPhotoBase64}`}
                                    className="register__proofPhoto"
                                />
                            )}
                            
                            <button
                                onClick={() => {
                                    setCheckWebcam(true);
                                    setTimeout(() => {
                                        setModalWebcam(true);
                                    }, 1000)
                                }}
                            >
                                Take photo
                            </button>
                        </div>
                    )}

                    {step > 1 && (
                        <>
                            {step === 2 && (
                                <CardCategoryRealizeInspection 
                                    data={categories[step -2]}
                                    pushResult={(id, isaIndex, report, proofPhoto) => attResults(id, isaIndex, report, proofPhoto)}
                                    isas={isas}
                                    step={step}
                                />
                            )}
                            {step === 3 && (
                                <CardCategoryRealizeInspection 
                                    data={categories[step - 2]}
                                    pushResult={(id, isaIndex, report, proofPhoto) => attResults(id, isaIndex, report, proofPhoto)}
                                    isas={isas}
                                    step={step}
                                />
                            )}
                        </>
                    )}
                </div>

                <div className="modal-realize__area-btn">
                    <button onClick={handlePreviousStep}>Previous</button>
                    <button 
                        onClick={() => {
                            if(step === 4){
                                validates();
                            }else{
                                handleNextStep();
                            }
                        }}
                    >
                        {step === 4 ? 'Finish Inspection' : 'Next Step'}
                    </button>
                </div>

            </Dialog.Content>

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
        </Dialog.Portal>
    )
}