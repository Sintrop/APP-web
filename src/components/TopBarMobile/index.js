import React, {useState} from 'react';
import {GoThreeBars} from 'react-icons/go';
import {RiCloseFill} from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import Menu from '../Menu';

export function TopBarMobile({toggleMenu, openMenu}){
    const {t} = useTranslation();
    const [routes, setRoutes] = useState(false)
    return(
        <div className="w-full flex flex-col lg:hidden">
            <div className="lg:hidden flex px-2 py-2 bg-[#0A4303] items-center justify-between w-full">
                <img
                    src={require('../../assets/logo-branco.png')}
                    className='w-32 object-contain'
                />

                <button
                    onClick={toggleMenu}
                >
                    {openMenu ? (
                        <RiCloseFill size={25} color='white' />
                    ) : (
                        <GoThreeBars size={25} color='white' />
                    )}
                </button>
            </div>

        </div>
    )
}