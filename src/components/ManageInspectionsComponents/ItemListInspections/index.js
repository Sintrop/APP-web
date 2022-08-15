import React, {useEffect, useState} from 'react';
import './itemListInspections.css';

//components
import ModalActions from '../ModalActions';
import ModalRealize from '../ModalRealize';
import ModalSeeResult from '../ModalSeeResult';
import Loading from '../../Loading';

//services
import {GetInspection} from '../../../services/manageInspectionsService';

export default function ItemListInspections({data, user, walletAddress, reloadInspections, setTab}){
    const [showActions, setShowActions] = useState(false);
    const [showModalRealize, setShowModalRealize] = useState(false);
    const [showSeeResult, setShowSeeResult] = useState(false);
    const [inspection, setInspection] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getInspection();
    },[]);

    async function getInspection(){
        const response = await GetInspection(data.id);
        setInspection(response);
    }

    return(
        <tr key={data.id}>
            <td>
                <a href='#'>
                    <p 
                        onClick={() => setTab('producer-page', data.createdBy)} 
                        className='id-wallets' 
                        title={data.createdBy}
                    >{data.createdBy}</p>
                </a>
            </td>
            <td>
                <p className='id-wallets' title={data.acceptedBy}>{data.acceptedBy}</p>
            </td>
            <td>
                <p>{data.createdAt}</p>
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
                    inspectionData={inspection}
                />
            )}

            {loading && (
                <Loading/>
            )}
        </tr>
    )
}