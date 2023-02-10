import React from 'react';
import './tabs.css';
import {useNavigate} from 'react-router';

export default function TabIndicator({activeTab, wallet}){
    const navigate = useNavigate();
    return(
        <div className='container-tabs'>
            <a
                onClick={() => navigate(`/dashboard/${wallet}/isa/main`)}
                style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}}
            >dashboard </a>
            <p> | {activeTab}</p>
        </div>
    )
}