import React, {useEffect, useState} from "react";
import { FaHome, FaUsers } from "react-icons/fa";
import { RiComputerFill } from "react-icons/ri";
import { BsFillGearFill } from "react-icons/bs";
import { useNavigate } from "react-router";

export function Header({routeActive}){
    const navigate = useNavigate();

    return(
        <div className="w-full flex items-center justify-center h-[60px] lg:h-[80px] bg-[#0a4303] py-2 fixed top-10 left-0 border-b-2 border-green-700">
            <div className="flex items-center justify-between overflow-x-auto lg:min-w-[1024px]">
                <div>
                    <img
                        src={require('../../assets/logo-branco.png')}
                        className="w-[120px] h-[80px] object-contain"
                    />
                </div>
                <div className="flex items-center">
                    <button 
                        className="flex flex-col items-center hover:text-white w-[85px] lg:w-[100px]"
                        onClick={() => navigate('/')}
                    >
                        <div className="hidden lg:flex">
                            <FaHome color={routeActive === 'home' ? 'white' : '#ccc'} size={25}/>
                        </div>
                        <div className="lg:hidden">
                            <FaHome color={routeActive === 'home' ? 'white' : '#ccc'} size={18}/>
                        </div>
                        <p className={`${routeActive === 'home' ? 'text-white' : 'text-[#ccc]'} text-sm lg:text-base`}>Início</p>

                        {routeActive === 'home' && (
                            <div className="w-full h-1 bg-white rounded-full"/>
                        )}
                    </button>
                    <button 
                        className="flex flex-col items-center hover:text-white w-[85px] lg:w-[100px]"
                        onClick={() => navigate('/centers')}
                    >
                        <div className="hidden lg:flex">
                            <RiComputerFill color={routeActive === 'centers' ? 'white' : '#ccc'} size={25}/>
                        </div>
                        <div className="lg:hidden">
                            <RiComputerFill color={routeActive === 'centers' ? 'white' : '#ccc'} size={18}/>
                        </div>
                        <p className={`${routeActive === 'centers' ? 'text-white' : 'text-[#ccc]'} text-sm lg:text-base`}>Centros</p>

                        {routeActive === 'centers' && (
                            <div className="w-full h-1 bg-white rounded-full"/>
                        )}
                    </button>

                    <button 
                        className="flex flex-col items-center hover:text-white w-[85px] lg:w-[100px]"
                        onClick={() => navigate('/regeneration-credit')}
                    >
                        <div className="py-3">
                            <img
                                src={require('../../assets/token.png')}
                                className="w-8 h-8 object-contain"
                            />
                        </div>

                        {routeActive === 'regeneration-credit' && (
                            <div className="w-full h-1 bg-white rounded-full"/>
                        )}
                    </button>

                    <button 
                        className="flex flex-col items-center hover:text-white w-[85px] lg:w-[100px]"
                        onClick={() => navigate('/community')}
                    >
                        <div className="hidden lg:flex">
                            <FaUsers color={routeActive === 'community' ? 'white' : '#ccc'} size={25}/>
                        </div>
                        <div className="lg:hidden">
                            <FaUsers color={routeActive === 'community' ? 'white' : '#ccc'} size={18}/>
                        </div>
                        
                        <p className={`${routeActive === 'community' ? 'text-white' : 'text-[#ccc]'} text-sm lg:text-base`}>Comunidade</p>

                        {routeActive === 'community' && (
                            <div className="w-full h-1 bg-white rounded-full"/>
                        )}
                    </button>

                    <button 
                        className="flex flex-col items-center hover:text-white w-[85px] lg:w-[100px]"
                        onClick={() => navigate('/actions')}
                    >
                        <div className="hidden lg:flex">
                            <BsFillGearFill color={routeActive === 'actions' ? 'white' : '#ccc'} size={25}/>
                        </div>
                        <div className="lg:hidden">
                            <BsFillGearFill color={routeActive === 'actions' ? 'white' : '#ccc'} size={18}/>
                        </div>
                        
                        <p className={`${routeActive === 'actions' ? 'text-white' : 'text-[#ccc]'} text-sm lg:text-base`}>Ações</p>

                        {routeActive === 'actions' && (
                            <div className="w-full h-1 bg-white rounded-full"/>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}