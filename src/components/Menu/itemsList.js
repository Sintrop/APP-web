import React, { useState } from 'react';
import './menu.css';

export default function ItemsList({data, changeTab, toggle,  open, openPools, openCertificates}){
    const {id, title, icon, action, subItem} = data;

    if(subItem && data.id === 'rankings') {
        return (
        <>
            <div className='container-item-list' onClick={() => toggle(data.id)}>
                <img className='icon-list' src={icon}/>
                <p>{title}</p>
            </div>
            { subItem && (
                subItem.map(item => (<div key={item.id} className='subItem' style={{ display: `${open ? '' : 'none'}`}}  onClick={() => changeTab(item.id)} > {item.label} </div>))
            )}
        </>
        )
    }

    if(subItem && data.id === 'pools') {
        return (
        <>
            <div className='container-item-list' onClick={() => toggle(data.id)}>
                <img className='icon-list' src={icon}/>
                <p>{title}</p>
            </div>
            { subItem && (
                subItem.map(item => (<div key={item.id} className='subItem' style={{ display: `${openPools ? '' : 'none'}`}}  onClick={() => changeTab(item.id)} > {item.label} </div>))
            )}
        </>
        )
    }

    if(subItem && data.id === 'certificates') {
        return (
        <>
            <div className='container-item-list' onClick={() => toggle(data.id)}>
                <img className='icon-list' src={icon}/>
                <p>{title}</p>
            </div>
            { subItem && (
                subItem.map(item => (<div key={item.id} className='subItem' style={{ display: `${openCertificates ? '' : 'none'}`}}  onClick={() => changeTab(item.id)} > {item.label} </div>))
            )}
        </>
        )
    }
    return(
        <div className='container-item-list' onClick={() => changeTab(id)}>
            <img className='icon-list' src={icon}/>
            <p>{title}</p>
        </div>
    )
}