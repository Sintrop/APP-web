import React, { useState, useContext } from "react";
import "./menu.css";
import {BsChevronDoubleLeft, BsChevronDoubleRight} from 'react-icons/bs';
import { MainContext } from "../../contexts/main";
import Logo from "../../assets/img/262543420-sintrop-logo-com-degrade.png";
import LogoSimple from '../../assets/img/logo-simple.png'
import IconISA from "../../assets/img/263926603-6.png";
import IconInspections from "../../assets/img/263926582-4.png";
import IconAcceptedInspection from "../../assets/img/263926589-5.png";
import IconProducers from "../../assets/img/263926618-8.png";
import IconActivists from "../../assets/img/263926692-20.png";
import IconMyAccount from "../../assets/img/263926648-13.png";
import IconCertificate from "../../assets/img/263926557-1.png";
import IconPools from "../../assets/img/263926606-7.png";

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
        icon: IconActivists,
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
        { id: "isa", title: "Sustainable Agriculture Index", icon: IconISA, action: "" },
        {
        id: "inspection-history",
        title: "Inspections History",
        icon: IconInspections,
        action: "",
        },
        {
        id: "manage-inspections",
        title: "Manage Inspections",
        icon: IconAcceptedInspection,
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
        icon: IconPools, 
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
        { id: "my-account", title: "My Account", icon: IconMyAccount, action: "" },
        { id: "researches", title: "Research Center", icon: IconISA, action: "" },
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
        <div className="container-menu">
            {menuOpen ? (
                <img className="img-logo" src={Logo} />
            ) : (
                <img className="img-logo-simple" src={LogoSimple} />
            )}

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

            <button
                onClick={() => {
                    toggleMenu()
                    if(menuOpen){
                        setOpen(false);
                        setOpenCertificates(false);
                        setOpenPools(false)
                    }
                }}
                className='menu__btn-change-open'
            >
                {menuOpen ? (
                    <BsChevronDoubleLeft color='green' size={20}/>
                ) : (
                    <BsChevronDoubleRight color='green' size={20}/>
                )}
            </button>
        </div>
    );
}
