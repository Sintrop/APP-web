import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { api } from "../../services/api";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/TopBar";

const containerMapStyle = {
    width: '100vw',
    height: '92vh',
};

const center = {
    lat: -11.680854,
    lng: -51.9245419
};

export function Community() {
    const navigate = useNavigate();
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    async function getUsers() {
        let newArray = [];

        const response = await api.get('/users');
        const users = response.data.users;

        for (var i = 0; i < users.length; i++) {
            if(users[i].userType === 1){
                if (users[i].geoLocation) {
                    if (users[i].accountStatus === 'blockchain') {
                        newArray.push(users[i])
                    }
                }
            }
        }

        setMarkers(newArray);
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh] overflow-hidden`}>
            <TopBar/>
            <Header routeActive='community' />

            <div className="flex flex-col items-center w-full mt-32">
                <LoadScript
                    googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}
                    libraries={['drawing']}
                >
                    <GoogleMap
                        mapContainerStyle={containerMapStyle}
                        center={center}
                        zoom={4}
                        mapTypeId="hybrid"
                    >
                        {markers.map(item => {
                            const location = JSON.parse(item?.geoLocation);

                            return(
                                <Marker
                                    position={{lat: location?.latitude, lng: location?.longitude}}
                                />
                            )
                        })}
                    </GoogleMap>

                </LoadScript>
                <div className="absolute flex flex-col w-[300px] gap-2 left-3 top-36">
                    <button 
                        className="w-full h-12 p-2 rounded-md bg-green-800 shadow-md flex items-center justify-between"
                        onClick={() => navigate('/ranking/1')}
                    >
                        <div className="flex items-center gap-2">
                            <img
                                src={require('../../assets/icon-produtor.png')}
                                className="w-8 h-8 object-contain"
                            />

                            <p className="font-bold text-white">Produtores</p>
                        </div>

                        <FaChevronRight size={20} color='white' />
                    </button>

                    <button 
                        className="w-full h-12 p-2 rounded-md bg-green-800 shadow-md flex items-center justify-between"
                        onClick={() => navigate('/ranking/2')}
                    >
                        <div className="flex items-center gap-2">
                            <img
                                src={require('../../assets/icon-inspetor.png')}
                                className="w-8 h-8 object-contain"
                            />

                            <p className="font-bold text-white">Inspetores</p>
                        </div>

                        <FaChevronRight size={20} color='white' />
                    </button>

                    <button 
                        className="w-full h-12 p-2 rounded-md bg-green-800 shadow-md flex items-center justify-between"
                        onClick={() => navigate('/ranking/3')}
                    >
                        <div className="flex items-center gap-2">
                            <img
                                src={require('../../assets/icon-pesquisadores.png')}
                                className="w-8 h-8 object-contain"
                            />

                            <p className="font-bold text-white">Pesquisadores</p>
                        </div>

                        <FaChevronRight size={20} color='white' />
                    </button>

                    <button 
                        className="w-full h-12 p-2 rounded-md bg-green-800 shadow-md flex items-center justify-between"
                        onClick={() => navigate('/ranking/4')}
                    >
                        <div className="flex items-center gap-2">
                            <img
                                src={require('../../assets/centro-dev.png')}
                                className="w-8 h-8 object-contain"
                            />

                            <p className="font-bold text-white">Desenvolvedores</p>
                        </div>

                        <FaChevronRight size={20} color='white' />
                    </button>

                    <button 
                        className="w-full h-12 p-2 rounded-md bg-green-800 shadow-md flex items-center justify-between"
                        onClick={() => navigate('/ranking/6')}
                    >
                        <div className="flex items-center gap-2">
                            <img
                                src={require('../../assets/icon-ativista.png')}
                                className="w-8 h-8 object-contain"
                            />

                            <p className="font-bold text-white">Ativistas</p>
                        </div>

                        <FaChevronRight size={20} color='white' />
                    </button>

                    <button 
                        className="w-full h-12 p-2 rounded-md bg-green-800 shadow-md flex items-center justify-between"
                        onClick={() => navigate('/ranking/8')}
                    >
                        <div className="flex items-center gap-2">
                            <img
                                src={require('../../assets/icon-validator.png')}
                                className="w-8 h-8 object-contain"
                            />

                            <p className="font-bold text-white">Validadores</p>
                        </div>

                        <FaChevronRight size={20} color='white' />
                    </button>

                    <button 
                        className="w-full h-12 p-2 rounded-md bg-green-800 shadow-md flex items-center justify-between"
                        onClick={() => navigate('/ranking/7')}
                    >
                        <div className="flex items-center gap-2">
                            <img
                                src={require('../../assets/icon-apoiador.png')}
                                className="w-8 h-8 object-contain"
                            />

                            <p className="font-bold text-white">Apoiadores</p>
                        </div>

                        <FaChevronRight size={20} color='white' />
                    </button>
                </div>
            </div>
        </div>
    )
}