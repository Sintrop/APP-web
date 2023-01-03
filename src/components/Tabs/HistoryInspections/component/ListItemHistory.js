import React, { useEffect, useState} from 'react';
import '../../../ManageInspectionsComponents/ItemListInspections/itemListInspections.css';
import {format} from 'date-fns';

import Loading from '../../../Loading';
import ModalSeeResult from '../../../ManageInspectionsComponents/ModalSeeResult';
import ModalRealize from '../../../ManageInspectionsComponents/ModalRealize';
import ModalActions from '../../../ManageInspectionsComponents/ModalActions';

export default function ListItemHistory({data, user, walletAddress, reloadInspections, setTab}){
    const [showActions, setShowActions] = useState(false);
    const [showModalRealize, setShowModalRealize] = useState(false);
    const [showSeeResult, setShowSeeResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [acceptedAt, setAcceptedAt] = useState('');
    const [createdAt, setCreatedAt] = useState('');

    useEffect(() => {
        timestampToDate();
    }, []);

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
                <a href={`/dashboard/${walletAddress}/producer-page/${data.createdBy}`}>
                <p className='id-wallets' title={data.createdBy}>{data.createdBy}</p>
                </a>
            </td>
            <td>
                {data.status == 0 ? (
                    <p>No accepted</p>
                ) : (
                    <a href={`/dashboard/${walletAddress}/activist-page/${data.acceptedBy}`}>
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
                <p>{acceptedAt}</p>
            </td>
            <td>
                <p>{data.isaScore}</p>
            </td>
            <td className='td-actions-manage-inspections'>
                <button 
                    onClick={() => setShowActions(true)} 
                    className='btn-show-actions'>
                    
                </button>
            </td>
            <td className='td-actions-manage-inspections'>
                <button 
                    onClick={() => setShowActions(true)} 
                    className='btn-show-actions'>
                    ...
                </button>
            </td>

            {showActions && (
                <div className='container-modal-actions'>
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
                </div>
            )}

            {showModalRealize && (
                <ModalRealize
                    close={() => setShowModalRealize(false)}
                    inspectionID={data.id}
                    walletAddress={walletAddress}
                    reloadInspections={() => {
                        setShowActions(false);
                        reloadInspections();
                    }}
                />
            )}

            {showSeeResult && (
                <ModalSeeResult
                    close={() => setShowSeeResult(false)}
                    inspectionData={data}
                />
            )}

            {loading && (
                <Loading/>
            )}
        </tr>
    )
}