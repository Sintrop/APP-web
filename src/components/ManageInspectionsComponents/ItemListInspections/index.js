import React, {useEffect, useState} from 'react';
import './itemListInspections.css';
import {format} from 'date-fns';
import { useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';

//components
import ModalActions from '../ModalActions';
import ModalRealize from '../ModalRealize';
import ModalSeeResult from '../ModalSeeResult';
import Loading from '../../Loading';

//services
import {GetInspection} from '../../../services/manageInspectionsService';

export default function ItemListInspections({data, user, walletAddress, reloadInspections, setTab}){
    const navigate = useNavigate();
    const [showActions, setShowActions] = useState(false);
    const [showModalRealize, setShowModalRealize] = useState(false);
    const [showSeeResult, setShowSeeResult] = useState(false);
    const [inspection, setInspection] = useState([]);
    const [loading, setLoading] = useState(false);
    const [acceptedAt, setAcceptedAt] = useState('');
    const [createdAt, setCreatedAt] = useState('');

    useEffect(() => {
        getInspection();
        timestampToDate();
    },[]);

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
                {data.status == 0 ? (
                    <p>Not accepted</p>
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
                
            </td>
            <td>
                {data.status == '0' && (
                    <div className='status-open'>
                        <p className='tit-status'>OPEN</p>
                    </div>
                )}
                {data.status == '1' && (
                    <div className='status-accepted'>
                        <p className='tit-status'>ACCEPTED</p>
                    </div>
                )}
                {data.status == '2' && (
                    <div className='status-inspected'>
                        <p className='tit-status'>INSPECTED</p>
                    </div>
                )}
            </td>
            <td>
                {acceptedAt}
            </td>
            <td>
                <p>{data.isaScore}</p>
            </td>
            <td className='td-actions-manage-inspections'>
                <button 
                    onClick={() => setShowActions(true)} 
                    className='btn-show-actions'>
                    ...
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

            {showSeeResult && (
                <ModalSeeResult
                    close={() => setShowSeeResult(false)}
                    inspectionData={inspection}
                />
            )}

            {loading && (
                <Loading/>
            )}
        </tr>
    )
}