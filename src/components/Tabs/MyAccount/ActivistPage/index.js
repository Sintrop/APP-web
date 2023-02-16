import React, {useState, useEffect, useContext} from 'react';
import {MainContext} from '../../../../contexts/main';
import {FaLock, FaCheck} from 'react-icons/fa';
import ActivistService from '../../../../services/activistService';
import {GetInspections, CanAcceptInspection} from '../../../../services/manageInspectionsService';
import * as Dialog from '@radix-ui/react-dialog';
import ModalDelation from '../../../ModalDelation';
import {get} from '../../../../config/infura';
import {useParams} from 'react-router-dom';

//components
import ItemInspection from '../../../ProducerPageComponents/ItemInspection';

export default function ActivistPage({wallet, setTab}){
    const {user, chooseModalRegister, blockNumber, walletConnected} = useContext(MainContext);
    const activistService = new ActivistService(walletConnected)
    const [activistData, setActivistData] = useState([]);
    const [inspections, setInspections] = useState([]);
    const [base64, setBase64] = useState('');
    const {tabActive, walletSelected} = useParams();
    const [modalDelation, setModalDelation] = useState(false);

    useEffect(() => {
        getActivist();
        if(user === '2'){
            isActivist();
        }
    },[]);

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive]);

    async function isActivist() {
        
    }

    async function getActivist(){
        const response = await activistService.getAtivist(walletSelected);
        setActivistData(response)
        getBase64(response.proofPhoto)
        getInspections();
    }

    async function getInspections(){
        const response = await GetInspections();
        setInspections(response);
    }

    async function getBase64(data){
        const res = await get(data);
        setBase64(res);
    }

    return(
        <div className='container__producer-page'>
            <div className='content__producer-page'>
                <div className='producer-area-info__producer-page'>
                    <div className='area-avatar__producer-page'>
                        <img 
                            src={`data:image/png;base64,${base64}`}
                            className='avatar__producer-page'
                            
                        />
                        <div className='producer-cards-info__producer-page card-wallet'>
                            <h1 className='tit-cards-info__producer-page'>Activist Wallet: </h1>
                            <a className='description-cards-info__producer-page'>
                                {activistData === [] ? '' : activistData.activistWallet}
                            </a>
                        </div>

                        <Dialog.Root
                            open={modalDelation}
                            onOpenChange={(open) => {
                                setModalDelation(open);
                            }}
                        >
                            {user === '0' ? (
                                <button className='area-avatar__btn-report' onClick={chooseModalRegister}>
                                    Report Activist
                                </button>
                            ) : (
                                <Dialog.Trigger className='area-avatar__btn-report'>
                                    Report Activist
                                </Dialog.Trigger>
                            )}
                            <ModalDelation 
                                close={() => setModalDelation(false)}
                            />
                        </Dialog.Root>
                    </div>  

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Name: </h1>
                        <p className='description-cards-info__producer-page'>
                            {activistData === [] ? '' : activistData.name}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Address: </h1>
                        <p className='description-cards-info__producer-page'>
                            {activistData.activistAddress === undefined ? '' : `${activistData.activistAddress.city}/${activistData.activistAddress.state}, ${activistData.activistAddress.country}`}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Total Inspections:</h1>
                        <p className='description-cards-info__producer-page'>
                            {activistData === [] ? '' : activistData.totalInspections}
                        </p>
                    </div>
                            
                    {user === '2' && (
                        <div className='producer-cards-info__producer-page'>
                            <h1 className='tit-cards-info__producer-page'>Prox Accept: </h1>
                            {Number(activistData?.lastAcceptedAt) === 0 ? (
                                <div style={{
                                        display: 'flex', 
                                        flexDirection: 'row', 
                                        marginLeft: 5, 
                                        color: 'green', 
                                        alignItems: 'center'
                                    }}
                                >
                                    <FaCheck size={15} style={{marginRight: 5}}/>
                                    Your may accept inspection
                                </div>
                            ) : (
                                <>
                                {(Number(activistData?.lastAcceptedAt) + process.env.REACT_APP_TIME_BETWEEN_INSPECTIONS) - Number(blockNumber) < 0 ? (
                                    <div style={{
                                            display: 'flex', 
                                            flexDirection: 'row', 
                                            marginLeft: 5, 
                                            color: 'green', 
                                            alignItems: 'center'
                                        }}
                                    >
                                        <FaCheck size={15} style={{marginRight: 5}}/>
                                        Your may accept inspection
                                    </div>
                                ) : (
                                    <div style={{
                                            display: 'flex', 
                                            flexDirection: 'row', 
                                            marginLeft: 5, 
                                            color: 'red', 
                                            alignItems: 'center'
                                        }}
                                    >
                                        <FaLock size={15} style={{marginRight: 5}}/>
                                        Wait {(Number(activistData?.lastAcceptedAt) + process.env.REACT_APP_TIME_BETWEEN_INSPECTIONS) - Number(blockNumber)} blocks to accept.
                                    </div>
                                )}
                                </>
                            )}
                            
                        </div>
                    )}
                </div>

                <div className='inspections-area__producer-page'> 
                    {inspections.map((item) => {
                        if(item.acceptedBy == activistData.activistWallet){
                            return(
                                <ItemInspection 
                                    data={item}
                                    key={item.id} 
                                    setTab={(tab, wallet) => setTab(tab, wallet)}
                                    typeAccount='activist'     
                                />
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}