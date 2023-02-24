import React, { useState } from 'react';
import './menu.css';
import {useParams} from 'react-router-dom';
import {BsChevronDown, BsChevronUp} from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

export default function ItemsList({data, changeTab, toggle,  open, openPools, openCertificates, menuOpen}){
    const {t} = useTranslation();
    const {tabActive} = useParams();
    const {id, title, icon, action, subItem} = data;

    if(subItem && data.id === 'rankings') {
        return (
        <>
            <div className='container-item-list' onClick={() => toggle(data.id)}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <img className='icon-list' alt={title} title={title} src={icon}/>
                    {menuOpen && (
                        <p>{t(title)}</p>
                    )}
                </div>
                {open ? (
                    <BsChevronUp size={15} color='green'/>
                ) : (
                    <BsChevronDown size={15} color='green' style={{marginLeft: 10}}/>
                )}
            </div>
            { subItem && (
                subItem.map(item => (
                    <div 
                        key={item.id} 
                        className='subItem' 
                        style={{ 
                            display: `${open ? '' : 'none'}`,
                            backgroundColor: tabActive === item.id && '#ddd'
                        }}  
                        onClick={() => changeTab(item.id)} 
                    > 
                        <p style={{margin: 0, marginTop: 5}}>{t(item.label)}</p>
                         
                    </div>
                ))
            )}
        </>
        )
    }

    if(subItem && data.id === 'pools') {
        return (
        <>
            <div className='container-item-list' onClick={() => toggle(data.id)}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <img className='icon-list' alt={title} title={title} src={icon}/>
                    {menuOpen && (
                        <p>{t(title)}</p>
                    )}
                </div>
                {openPools ? (
                    <BsChevronUp size={15} color='green'/>
                ) : (
                    <BsChevronDown size={15} color='green' style={{marginLeft: 10}}/>
                )}
            </div>
            { subItem && (
                subItem.map(item => (
                    <div 
                        key={item.id} 
                        className='subItem' 
                        style={{ 
                            display: `${openPools ? '' : 'none'}`,
                            backgroundColor: tabActive === item.id && '#ddd'
                        }}  
                        onClick={() => changeTab(item.id)} 
                    > 
                        <p style={{margin: 0, marginTop: 5}}>{t(item.label)}</p>
                        
                    </div>
                ))
            )}
        </>
        )
    }

    if(subItem && data.id === 'certificates') {
        return (
        <>
            <div className='container-item-list' onClick={() => toggle(data.id)}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <img className='icon-list' alt={title} title={title} src={icon}/>
                    {menuOpen && (
                        <p>{t(title)}</p>
                    )}
                </div>
                {openCertificates ? (
                    <BsChevronUp size={15} color='green'/>
                ) : (
                    <BsChevronDown size={15} color='green' style={{marginLeft: 10}}/>
                )}
            </div>
            { subItem && (
                subItem.map(item => (
                    <div 
                        key={item.id} 
                        className='subItem' 
                        style={{ 
                            display: `${openCertificates ? '' : 'none'}`, 
                            backgroundColor: tabActive === item.id && '#ddd'
                        }}  
                        onClick={() => changeTab(item.id)} 
                    > 
                        <p style={{margin: 0, marginTop: 5}}>{t(item.label)}</p>
                         
                    </div>
                ))
            )}
        </>
        )
    }
    return(
        <div 
            className='container-item-list' 
            onClick={() => changeTab(id)}
            style={{backgroundColor: tabActive === data.id && '#ddd',}}
        >
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <img className='icon-list' alt={title} title={title} src={icon}/>
                {menuOpen && (
                    <p>{t(title)}</p>
                )}
            </div>
            <div/>
        </div>
    )
}