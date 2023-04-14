import React, { useState, useContext } from "react";
import "./menu.css";
import {BsChevronDoubleLeft, BsChevronDoubleRight} from 'react-icons/bs';
import { MainContext } from "../../contexts/main";

import IconCommunity from '../../assets/icon-community.png'
import IconIndice from '../../assets/icon-indice.png';
import IconHistory from '../../assets/icon-history.png';
import IconManage from '../../assets/icon-manage.png';
import IconCertificate from '../../assets/icon-certificate.png';
import IconSac from '../../assets/icon-sac.png';
import IconPesquisas from '../../assets/icon-pesquisas.png';
import IconAccount from '../../assets/icon-account.png';

import ItemsList from "./itemsList";

export default function Menu({ changeTab }) {
    const {menuOpen, toggleMenu} = useContext(MainContext);
    const [open, setOpen] = useState(false);
    const [openPools, setOpenPools] = useState(false);
    const [openCertificates, setOpenCertificates] = useState(false);
    const [itemsMenu, setItemsMenu] = useState([
        {
        id: "rankings",
        title: "Community",
        icon: IconCommunity,
        action: "",
        subItem: [
            { id: "producers", label: "Producers" },
            { id: "activists", label: "Activists" },
            { id: "advisors", label: "Advisors" },
            { id: "investors", label: "Investors" },
            { id: "developers", label: "Developers" },
            { id: "contributors", label: "Contributors" },
            { id: "researchers", label: "Researchers" },
        ],
        },
        { id: "isa", title: "Sustainable Agriculture Index", icon: IconIndice, action: "" },
        {
        id: "inspection-history",
        title: "Inspections History",
        icon: IconHistory,
        action: "",
        },
        {
        id: "manage-inspections",
        title: "Manage Inspections",
        icon: IconManage,
        action: "",
        },
        // { id: "producers", title: "Producers", icon: IconProducers, action: "" },
        // { id: "activists", title: "Activists", icon: IconActivists, action: "" },
        {
        id: "certificates",
        title: "Certificates",
        icon: IconCertificate,
        action: "",
        subItem:[
            {id: 'producer-certificate', label: 'Producer'},
            {id: 'investor-certificate', label: 'Investor'},
        ]
        },
        { 
        id: "pools", 
        title: "SAC Token", 
        icon: IconSac, 
        action: "",
        subItem: [
            {id: 'producers-pool', label: 'Producers'},
            {id: 'developers-pool', label: 'Developers'},
        ] 
        },
        //{ 
        //  id: "delations", 
        //  title: "Delations", 
        //  icon: IconInspections, 
        //  action: ""
        //},
        { id: "my-account", title: "My Account", icon: IconAccount, action: "" },
        { id: "researches", title: "Research Center", icon: IconPesquisas, action: "" },
    ]);
    const toggleSubItem = (id) => {
        if(id === 'rankings'){
        setOpen((oldValue) => !oldValue);
        }
        if(id === 'pools'){
        setOpenPools((oldValue) => !oldValue);
        }
        if(id === 'certificates'){
        setOpenCertificates((oldValue) => !oldValue);
        }
    };
    return (
        <div className="hidden lg:flex flex-col overflow-auto bg-[#0A4303] mt-12 h-[95vh] fixed duration-200" style={{width: menuOpen ? '350px' : '90px'}}>
            <div className="flex items-center justify-between">
                {menuOpen ? (
                    <img className="w-[120px] h-[80px] object-contain ml-4" src={require('../../assets/logo-branco.png')} />
                ) : (
                    <img className="w-[40px] h-[40px] object-contain ml-3 mt-4 mb-5" src={require('../../assets/logos-branco.png')} />
                )}

                <button
                    onClick={() => {
                        toggleMenu()
                        if(menuOpen){
                            setOpen(false);
                            setOpenCertificates(false);
                            setOpenPools(false)
                        }
                    }}
                    className='px-3 py-3 hover:bg-green-950'
                >
                    {menuOpen ? (
                        <BsChevronDoubleLeft color='green' size={20}/>
                    ) : (
                        <BsChevronDoubleRight color='green' size={20}/>
                    )}
                </button>
            </div>

            {itemsMenu.map((item) => {
                return (
                <ItemsList
                    data={item}
                    changeTab={(tab) => changeTab(tab)}
                    key={item.id}
                    subItem={item.subItem}
                    openCertificates={openCertificates}
                    openPools={openPools}
                    open={open}
                    toggle={(id) => {
                        toggleSubItem(id)
                        if(!menuOpen){
                            toggleMenu()
                        }
                        if(id === 'certificates'){
                            setOpenPools(false);
                            setOpen(false);  
                        }
                        if(id === 'rankings'){
                            setOpenPools(false);
                            setOpenCertificates(false);
                        }
                        if(id === 'pools'){
                            setOpen(false);
                            setOpenCertificates(false);
                        }
                    }}
                    menuOpen={menuOpen}
                />
                );
            })}
        </div>
    );
}
