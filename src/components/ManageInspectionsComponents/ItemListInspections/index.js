import React, {useEffect, useState, useContext} from 'react';
import './itemListInspections.css';
import {format} from 'date-fns';
import { useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import {BsGearFill} from 'react-icons/bs';
import { MainContext } from '../../../contexts/main';
import { useTranslation } from 'react-i18next';

//components
import ModalActions from '../ModalActions';
import ModalRealize from '../ModalRealize';
import ModalSeeResult from '../ModalSeeResult';
import Loading from '../../Loading';

//services
import {GetInspection} from '../../../services/manageInspectionsService';
import {GetProducer} from '../../../services/producerService';

export default function ItemListInspections({data, user, walletAddress, reloadInspections, setTab}){
    const {t} = useTranslation();
    const {blockNumber} = useContext(MainContext);
    const navigate = useNavigate();
    const [showActions, setShowActions] = useState(false);
    const [showModalRealize, setShowModalRealize] = useState(false);
    const [showSeeResult, setShowSeeResult] = useState(false);
    const [inspection, setInspection] = useState([]);
    const [loading, setLoading] = useState(false);
    const [acceptedAt, setAcceptedAt] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [status, setStatus] = useState('0');
    const [producerData, setProducerData] = useState({});

    useEffect(() => {
        getProducer()
        getInspection();
        timestampToDate();
        validateStatus(data.status);
    },[data]);

    async function getProducer() {
        const producer = await GetProducer(data?.createdBy);
        setProducerData(producer);
        console.log(producer)
    }

    function validateStatus(status){
        if(status === '0' || status === '2'){
            setStatus(status)
        }
        if(status === '1'){
            if(Number(data.acceptedAt) + Number(process.env.REACT_APP_BLOCKS_TO_EXPIRE_ACCEPTED_INSPECTION) < Number(blockNumber)){
                setStatus('3')
            }else{
                setStatus('1')
            }
        }
    }

    async function getInspection(){
        const response = await GetInspection(data.id);
        setInspection(response);
    }

    function timestampToDate(){
        const acceptedAtTime = parseInt(data.acceptedAtTimestamp);
        const createdAtTime = new Date(parseInt(data.createdAtTimestamp)*1000);
        setCreatedAt(format(createdAtTime, "dd/MM/yyyy - kk:mm"))
        if(acceptedAtTime === 0){
            setAcceptedAt('Not Accepted')
        }else{
            const date = new Date(acceptedAtTime*1000);
            setAcceptedAt(format(date, "dd/MM/yyyy - kk:mm"))
        }
    }

    return(
        <tr key={data.id}>
            <td>
                <a 
                    onClick={() => navigate(`/dashboard/${walletAddress}/producer-page/${data.createdBy}`)}
                    style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}} 
                >
                    <p  
                        className='id-wallets' 
                        title={data.createdBy}
                    >{data.createdBy}</p>
                </a>
            </td>
            <td>
                {producerData?.propertyAddress?.street}, {producerData?.propertyAddress?.city}-{producerData?.propertyAddress?.state}.
            </td>
            <td>
                {data.status == 0 ? (
                    <p>{t('Not accepted')}</p>
                ) : (
                    <a 
                        onClick={() => navigate(`/dashboard/${walletAddress}/activist-page/${data.acceptedBy}`)}
                        style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}} 
                    >
                        <p className='id-wallets' title={data.acceptedBy}>{data.acceptedBy}</p>
                    </a>
                )}
            </td>
            <td>
                <p>{createdAt}</p>
            </td>
            <td>
                {status === '0' && (
                    <p>{t('Not accepted')}</p>
                )}
                {status === '1' && (
                    <p>{t('Expires in')} {(Number(data.acceptedAt) + Number(process.env.REACT_APP_BLOCKS_TO_EXPIRE_ACCEPTED_INSPECTION)) - Number(blockNumber)} blocks</p>
                )}
                {status === '2' && (
                    <p>{t('Inspected')}</p>
                )}
                {status === '3' && (
                    <p>{t('Expired ago')} {Number(blockNumber) - (Number(data.acceptedAt) + Number(process.env.REACT_APP_BLOCKS_TO_EXPIRE_ACCEPTED_INSPECTION))} blocks</p>
                )}
            </td>
            <td>
                {status == '0' && (
                    <div className='status-open'>
                        <p className='tit-status'>{t('OPEN')}</p>
                    </div>
                )}
                {status == '1' && (
                    <div className='status-accepted'>
                        <p className='tit-status'>{t('ACCEPTED')}</p>
                    </div>
                )}
                {status == '2' && (
                    <div className='status-inspected'>
                        <p className='tit-status'>{t('INSPECTED')}</p>
                    </div>
                )}
                {status == '3' && (
                    <div className='status-expired'>
                        <p className='tit-status'>{t('EXPIRED')}</p>
                    </div>
                )}
            </td>
            <td>
                <p>{data.isaScore}</p>
            </td>
            <td style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: 70}}>
                <button 
                    onClick={() => setShowActions(true)} 
                    className='btn-show-actions'
                >
                    <BsGearFill size={20}/>
                </button>
            </td>

            <Dialog.Root
                open={showActions}
                onOpenChange={(open) => setShowActions(open)}
            >
                <ModalActions 
                    close={() => setShowActions(false)}
                    user={user}
                    item={data}
                    walletAddress={walletAddress}
                    showRealize={() => setShowModalRealize(true)}
                    showSeeResult={() => setShowSeeResult(true)}
                    reloadInspection={() => {
                        setLoading(false);
                        reloadInspections();
                    }}
                    setLoading={() => setLoading(!loading)}
                    status={status}
                />
            </Dialog.Root>

            {showActions && (
                <div className='container-modal-actions'>
                </div>
            )}

            <Dialog.Root
                open={showModalRealize}
                onOpenChange={(open) => setShowModalRealize(open)}
            >
                <ModalRealize
                    close={() => setShowModalRealize(false)}
                    inspectionID={data.id}
                    walletAddress={walletAddress}
                    reloadInspections={() => {
                        setShowActions(false);
                        reloadInspections();
                    }}
                />
            </Dialog.Root>

            <Dialog.Root
                open={showSeeResult}
                onOpenChange={(open) => setShowSeeResult(open)}
            >
                <ModalSeeResult
                    close={() => setShowSeeResult(false)}
                    inspectionData={data}
                />
            </Dialog.Root>

            {loading && (
                <Loading/>
            )}
        </tr>
    )
}