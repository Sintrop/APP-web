import React, { useState } from 'react';
import './menu.css';
import {useParams} from 'react-router-dom';
import {BsChevronDown, BsChevronUp} from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

export default function ItemsList({data, changeTab, toggle,  open, openPools, openCertificates, openInspections, menuOpen, openFinancial}){
    const {t} = useTranslation();
    const {tabActive} = useParams();
    const {id, title, icon, action, subItem} = data;

    if(subItem && data.id === 'rankings') {
        return (
        <>
            <div className='flex items-center justify-between px-4 h-16 hover:cursor-pointer hover:bg-green-950' onClick={() => toggle(data.id)}>
                <div className='flex items-center gap-2'>
                    <img className='w-8 h-8 object-contain' alt={title} title={title} src={icon}/>
                    {menuOpen && (
                        <p className='text-white'>{t(title)}</p>
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
                        className='flex items-center px-14 h-10 hover:bg-green-950 cursor-pointer' 
                        style={{ 
                            display: `${open ? '' : 'none'}`,
                            backgroundColor: tabActive === item.id && '#783E19'
                        }}  
                        onClick={() => changeTab(item.id)} 
                    > 
                        <p className='text-white'>{t(item.label)}</p>
                         
                    </div>
                ))
            )}
        </>
        )
    }

    if(subItem && data.id === 'pools') {
        return (
        <>
            <div className='flex items-center justify-between px-4 h-16 hover:cursor-pointer hover:bg-green-950' onClick={() => toggle(data.id)}>
                <div className='flex items-center gap-2'>
                    <img className='w-8 h-8 object-contain' alt={title} title={title} src={icon}/>
                    {menuOpen && (
                        <p className='text-white'>{t(title)}</p>
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
                        className='flex items-center px-14 h-10 hover:bg-green-950 cursor-pointer' 
                        style={{ 
                            display: `${openPools ? '' : 'none'}`,
                            backgroundColor: tabActive === item.id && '#783E19'
                        }}  
                        onClick={() => changeTab(item.id)} 
                    > 
                        <p className='text-white'>{t(item.label)}</p>
                        
                    </div>
                ))
            )}
        </>
        )
    }

    if(subItem && data.id === 'certificates') {
        return (
        <>
            <div className='flex items-center justify-between px-4 h-16 hover:cursor-pointer hover:bg-green-950' onClick={() => toggle(data.id)}>
                <div className='flex items-center gap-2'>
                    <img className='w-8 h-8 object-contain' alt={title} title={title} src={icon}/>
                    {menuOpen && (
                        <p className='text-white'>{t(title)}</p>
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
                        className='flex items-center px-14 h-10 hover:bg-green-950 cursor-pointer' 
                        style={{ 
                            display: `${openCertificates ? '' : 'none'}`, 
                            backgroundColor: tabActive === item.id && '#783E19'
                        }}  
                        onClick={() => changeTab(item.id)} 
                    > 
                        <p className='text-white'>{t(item.label)}</p>
                         
                    </div>
                ))
            )}
        </>
        )
    }

    if(subItem && data.id === 'inspections') {
        return (
        <>
            <div className='flex items-center justify-between px-4 h-16 hover:cursor-pointer hover:bg-green-950' onClick={() => toggle(data.id)}>
                <div className='flex items-center gap-2'>
                    <img className='w-8 h-8 object-contain' alt={title} title={title} src={icon}/>
                    {menuOpen && (
                        <p className='text-white'>{t(title)}</p>
                    )}
                </div>
                {openInspections ? (
                    <BsChevronUp size={15} color='green'/>
                ) : (
                    <BsChevronDown size={15} color='green' style={{marginLeft: 10}}/>
                )}
            </div>
            { subItem && (
                subItem.map(item => (
                    <div 
                        key={item.id} 
                        className='flex items-center px-14 h-10 hover:bg-green-950 cursor-pointer' 
                        style={{ 
                            display: `${openInspections ? '' : 'none'}`, 
                            backgroundColor: tabActive === item.id && '#783E19'
                        }}  
                        onClick={() => changeTab(item.id)} 
                    > 
                        <p className='text-white'>{t(item.label)}</p>
                         
                    </div>
                ))
            )}
        </>
        )
    }

    if(subItem && data.id === 'financial-center') {
        return (
        <>
            <div className='flex items-center justify-between px-4 h-16 hover:cursor-pointer hover:bg-green-950' onClick={() => toggle(data.id)}>
                <div className='flex items-center gap-2'>
                    <img className='w-8 h-8 object-contain' alt={title} title={title} src={icon}/>
                    {menuOpen && (
                        <p className='text-white'>{t(title)}</p>
                    )}
                </div>
                {openFinancial ? (
                    <BsChevronUp size={15} color='green'/>
                ) : (
                    <BsChevronDown size={15} color='green' style={{marginLeft: 10}}/>
                )}
            </div>
            { subItem && (
                subItem.map(item => (
                    <div 
                        key={item.id} 
                        className='flex items-center px-14 h-10 hover:bg-green-950 cursor-pointer' 
                        style={{ 
                            display: `${openFinancial ? '' : 'none'}`, 
                            backgroundColor: tabActive === item.id && '#783E19'
                        }}  
                        onClick={() => changeTab(item.id)} 
                    > 
                        <p className='text-white'>{t(item.label)}</p>
                         
                    </div>
                ))
            )}
        </>
        )
    }

    return(
        <div 
            className='flex items-center px-4 h-16 hover:cursor-pointer hover:bg-green-950' 
            onClick={() => changeTab(id)}
            style={{backgroundColor: tabActive === data.id && '#783E19',}}
        >
            <div className='flex items-center gap-2'>
                <img className='w-8 h-8 object-contain' alt={title} title={title} src={icon}/>
                {menuOpen && (
                    <p className='text-white'>{t(title)}</p>
                )}
            </div>
            <div/>
        </div>
    )
}