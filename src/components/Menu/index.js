import React, {useState} from 'react';
import './menu.css';

import Logo from '../../assets/img/262543420-sintrop-logo-com-degrade.png';
import IconISA from '../../assets/img/263926603-6.png';
import IconInspections from '../../assets/img/263926582-4.png';
import IconAcceptedInspection from '../../assets/img/263926589-5.png';
import IconProducers from '../../assets/img/263926618-8.png';
import IconActivists from '../../assets/img/263926692-20.png';
import IconMyAccount from '../../assets/img/263926648-13.png';
import IconCertificate from '../../assets/img/263926557-1.png';
import IconPools from '../../assets/img/263926606-7.png';

import ItemsList from './itemsList';

export default function Menu({changeTab}){
    const [itemsMenu, setItemsMenu] = useState([
        {id: 'isa', title: 'ISA', icon: IconISA, action: ''},
        {id: 'inspection-history', title: 'Inspection History', icon: IconInspections, action: ''},
        {id: 'manage-inspections', title: 'Manage Inspections', icon: IconAcceptedInspection, action: ''},
        {id: 'producers', title: 'Producers', icon: IconProducers, action: ''},
        {id: 'activists', title: 'Activists', icon: IconActivists, action: ''},
        {id: 'my-account', title: 'My Account', icon: IconMyAccount, action: ''},
        {id: 'certificate', title: 'Certificate', icon: IconCertificate, action: ''},
        {id: 'pools', title: 'Pools', icon: IconPools, action: ''},
    ])
    return(
        <div className='container-menu'>
            <img className='img-logo' src={Logo}/>
            
            {itemsMenu.map((item) => {
                return(
                    <ItemsList 
                        data={item} 
                        changeTab={(tab) => changeTab(tab)}
                        key={item.id}
                    />
                )
            })}
        </div>
    )
}