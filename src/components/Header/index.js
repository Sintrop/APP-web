import React, {useEffect, useState} from "react";
import { FaHome, FaUsers } from "react-icons/fa";
import { RiComputerFill } from "react-icons/ri";
import { BsFillGearFill } from "react-icons/bs";
import { useNavigate } from "react-router";

export function Header({routeActive}){
    const navigate = useNavigate();

    return(
        <div className="w-full flex items-center justify-center h-[80px] bg-[#0a4303] py-2 fixed top-0 left-0 border-b-2 border-green-700">
            <div className="flex items-center justify-between min-w-[1024px]">
                <div>
                    <img
                        src={require('../../assets/logo-branco.png')}
                        className="w-[120px] h-[80px] object-contain"
                    />
                </div>
                <div className="flex items-center">
                    <button 
                        className="flex flex-col items-center hover:text-white w-[100px]"
                        onClick={() => navigate('/')}
                    >
                        <FaHome color={routeActive === 'home' ? 'white' : '#ccc'} size={25}/>
                        <p className={`${routeActive === 'home' ? 'text-white' : 'text-[#ccc]'}`}>Início</p>

                        {routeActive === 'home' && (
                            <div className="w-full h-1 bg-white rounded-full"/>
                        )}
                    </button>
                    <button 
                        className="flex flex-col items-center hover:text-white w-[100px]"
                        onClick={() => navigate('/centers')}
                    >
                        <RiComputerFill color={routeActive === 'centers' ? 'white' : '#ccc'} size={25}/>
                        <p className={`${routeActive === 'centers' ? 'text-white' : 'text-[#ccc]'}`}>Centros</p>

                        {routeActive === 'centers' && (
                            <div className="w-full h-1 bg-white rounded-full"/>
                        )}
                    </button>

                    <button 
                        className="flex flex-col items-center hover:text-white w-[100px]"
                        onClick={() => navigate('/market')}
                    >
                        <img
                            src={require('../../assets/token.png')}
                            className="w-6 h-6 object-contain"
                        />
                        <p className={`${routeActive === 'market' ? 'text-white' : 'text-[#ccc]'}`}>Mercado</p>

                        {routeActive === 'market' && (
                            <div className="w-full h-1 bg-white rounded-full"/>
                        )}
                    </button>

                    <button 
                        className="flex flex-col items-center hover:text-white w-[100px]"
                        onClick={() => navigate('/community')}
                    >
                        <FaUsers color={routeActive === 'community' ? 'white' : '#ccc'} size={25}/>
                        <p className={`${routeActive === 'community' ? 'text-white' : 'text-[#ccc]'}`}>Comunidade</p>

                        {routeActive === 'community' && (
                            <div className="w-full h-1 bg-white rounded-full"/>
                        )}
                    </button>

                    <button 
                        className="flex flex-col items-center hover:text-white w-[100px]"
                        onClick={() => navigate('/actions')}
                    >
                        <BsFillGearFill color={routeActive === 'actions' ? 'white' : '#ccc'} size={25}/>
                        <p className={`${routeActive === 'actions' ? 'text-white' : 'text-[#ccc]'}`}>Ações</p>

                        {routeActive === 'actions' && (
                            <div className="w-full h-1 bg-white rounded-full"/>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}