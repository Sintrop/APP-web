import React, { useState } from 'react';
import './menu.css';

export default function ItemsList({data, changeTab, toggle,  open}){
    const {id, title, icon, action, subItem} = data;

    if(subItem) {
        return (
        <>
            <div className='container-item-list' onClick={() => toggle()}>
                <img className='icon-list' src={icon}/>
                <p>{title}</p>
            </div>
            { subItem && (
                subItem.map(item => (<div className='subItem' style={{ display: `${open ? '' : 'none'}`}}  onClick={() => changeTab(item.id)} > {item.label} </div>))
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