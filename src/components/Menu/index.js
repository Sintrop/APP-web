import React, { useState, useContext } from "react";
import "./menu.css";
import {BsChevronDoubleLeft, BsChevronDoubleRight} from 'react-icons/bs';
import { MainContext } from "../../contexts/main";
import { useNavigate, useParams } from "react-router";

import IconCommunity from '../../assets/icon-community.png'
import IconMissions from '../../assets/assistente.png';
import IconHistory from '../../assets/icon-history.png';
import IconManage from '../../assets/icon-manage.png';
import IconCertificate from '../../assets/icon-certificate.png';
import IconSac from '../../assets/token.png';
import IconPesquisas from '../../assets/icon-pesquisas.png';
import IconAccount from '../../assets/icon-account.png';
import IconNetwork from '../../assets/network.png';
import IconMarket from '../../assets/market-icon.png';
import IconDev from '../../assets/developer-center.png';

import ItemsList from "./itemsList";

export default function Menu({ changeTab }) {
    const navigate = useNavigate();
    const {walletAddress, typeUser} = useParams();
    const {menuOpen, toggleMenu} = useContext(MainContext);
    const [open, setOpen] = useState(false);
    const [openPools, setOpenPools] = useState(false);
    const [openCertificates, setOpenCertificates] = useState(false);
    const [openInspections, setOpenInspections] = useState(false);
    const [openFinancial, setOpenFinancial] = useState(false);
    const [itemsMenu, setItemsMenu] = useState([
        { id: "missions", title: "Missions", icon: IconMissions, action: "" },
        { id: "network-impact", title: "Network Impact", icon: IconNetwork, action: "" },
        {
            id: "rankings",
            title: "Community",
            icon: IconCommunity,
            action: "",
            subItem: [
                { id: "producers", label: "Producers" },
                { id: "inspectors", label: "Inspectors" },
                { id: "supporters", label: "Supporters" },
                { id: "developers", label: "Developers" },
                { id: "contributors", label: "Validators" },
                { id: "researchers", label: "Researchers" },
            ],
        },
        {
            id: "inspections",
            title: "Inspections Center",
            icon: IconHistory,
            action: "",
            subItem: [
                { id: "inspection-history", label: "Inspections History" },
                { id: "manage-inspections", label: "Manage Inspections" },
                { id: "isa", label: "Sustainable Agriculture Index"},
            ],
        },
        {
            id: "financial-center",
            title: "Financial Center",
            icon: IconMarket,
            action: "",
            subItem: [
                { id: "market", label: "Market" },
                { id: "private-sales", label: "Seed Round" },
                {id: 'producers-pool', label: 'Producers Pool'},
                {id: 'developers-pool', label: 'Developers Pool'},
            ],
        },
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
        { id: "researches", title: "Research Center", icon: IconPesquisas, action: "" },
        { id: "developers-center", title: "Development Center", icon: IconDev, action: "" },
        { id: "my-account", title: "My Account", icon: IconAccount, action: "" },
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
        if(id === 'inspections'){
            setOpenInspections((oldValue) => !oldValue);
        }
        if(id === 'financial-center'){
            setOpenFinancial((oldValue) => !oldValue);
        }
    };
    return (
        <div className="flex flex-col bg-[#0A4303] mt-12 lg:mt-12 fixed duration-200 z-70" style={{width: menuOpen ? '320px' : '90px'}}>
            <div className="hidden lg:flex items-center justify-between">
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

            <div className="flex flex-col h-[90vh] pb-20 overflow-auto scrollbar-thin scrollbar-thumb-green-900 scrollbar-thumb-rounded-md">
            {itemsMenu.map((item) => {
                return (
                    <div className="h-26  ">
                        <ItemsList
                            data={item}
                            changeTab={(tab) => {
                                if(tab === 'researches'){
                                    navigate(`/researchers-center/${walletAddress}/${typeUser}`);
                                    return;
                                }
                                if(tab === 'developers-center'){
                                    navigate(`/developers-center/${walletAddress}/${typeUser}`);
                                    return;
                                }
                                
                                changeTab(tab)
                            }}
                            key={item.id}
                            subItem={item.subItem}
                            openCertificates={openCertificates}
                            openInspections={openInspections}
                            openPools={openPools}
                            openFinancial={openFinancial}
                            open={open}
                            toggle={(id) => {
                                toggleSubItem(id)
                                if(!menuOpen){
                                    toggleMenu()
                                }
                                if(id === 'certificates'){
                                    setOpenPools(false);
                                    setOpen(false);  
                                    setOpenInspections(false);
                                    setOpenFinancial(false);
                                }
                                if(id === 'rankings'){
                                    setOpenPools(false);
                                    setOpenCertificates(false);
                                    setOpenInspections(false);
                                    setOpenFinancial(false);
                                }
                                if(id === 'pools'){
                                    setOpen(false);
                                    setOpenCertificates(false);
                                    setOpenInspections(false);
                                    setOpenFinancial(false);
                                }
                                if(id === 'inspections'){
                                    setOpen(false);
                                    setOpenFinancial(false);
                                    setOpenCertificates(false);
                                    
                                }
                                if(id === 'financial-center'){
                                    setOpenPools(false);
                                    setOpenCertificates(false);
                                    setOpenInspections(false);
                                }
                            }}
                            menuOpen={menuOpen}
                        />
                    </div>
                );
            })}
            </div>
        </div>
    );
}
