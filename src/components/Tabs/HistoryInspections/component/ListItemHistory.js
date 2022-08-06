import React, { useState} from 'react';
import '../../../ManageInspectionsComponents/ItemListInspections/itemListInspections.css';

//components
import ModalActions from '../../../ManageInspectionsComponents/ModalActions';
import ModalRealize from '../../../ManageInspectionsComponents/ModalRealize';
import Loading from '../../../Loading';

export default function ListItemHistory({data, user, walletAddress, reloadInspections}){
    const [showActions, setShowActions] = useState(false);
    const [loading, setLoading] = useState(false);


    return(
        <tr key={data.id}>
            <td>
                <p className='id-wallets' title={data.createdBy}>{data.createdBy}</p>
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
                    
                </button>
            </td>

            {loading && (
                <Loading/>
            )}
        </tr>
    )
}