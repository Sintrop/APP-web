import React, { useState } from "react";
import "./menu.css";

import Logo from "../../assets/img/262543420-sintrop-logo-com-degrade.png";
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
  const [open, setOpen] = useState(false);
  const [openPools, setOpenPools] = useState(false);
  const [itemsMenu, setItemsMenu] = useState([
    { id: "isa", title: "ISA", icon: IconISA, action: "" },
    {
      id: "inspection-history",
      title: "Inspection History",
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
      id: "rankings",
      title: "Community",
      icon: IconActivists,
      action: "",
      subItem: [
        { id: "producers", label: "Producers" },
        { id: "activists", label: "Activists" },
        { id: "advisors", label: "Advisors" },
        { id: "investors", label: "Investor" },
        { id: "developers", label: "Developers" },
        { id: "contributors", label: "Contributors" },
        { id: "researchers", label: "Researchers" },
      ],
    },
    { id: "my-account", title: "My Account", icon: IconMyAccount, action: "" },
    {
      id: "certificate",
      title: "Certificate",
      icon: IconCertificate,
      action: "",
    },
    { 
      id: "pools", 
      title: "Pools", 
      icon: IconPools, 
      action: "",
      subItem: [
        {id: 'developers-pool', label: 'Developers'},
        {id: 'producers-pool', label: 'Producers'}
      ] 
    },
    { 
      id: "delations", 
      title: "Delations", 
      icon: IconInspections, 
      action: ""
    },
  ]);
  const toggleSubItem = (id) => {
    if(id === 'rankings'){
      setOpen((oldValue) => !oldValue);
    }
    if(id === 'pools'){
      setOpenPools((oldValue) => !oldValue);
    }
  };
  return (
    <div className="container-menu">
      <img className="img-logo" src={Logo} />

      {itemsMenu.map((item) => {
        return (
          <ItemsList
            data={item}
            changeTab={(tab) => changeTab(tab)}
            key={item.id}
            subItem={item.subItem}
            openPools={openPools}
            open={open}
            toggle={(id) => toggleSubItem(id)}
          />
        );
      })}
    </div>
  );
}
