import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { api } from "../../services/api";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/TopBar";
import { ActivityIndicator } from "../../components/ActivityIndicator";
import { UserRankingItem } from "../Ranking/components/UserRankingItem";
import { Feedback } from "../../components/Feedback";

const containerMapStyle = {
    width: '100vw',
    height: '100%',
};

const center = {
    lat: -11.680854,
    lng: -51.9245419
};

export function Community() {
    const navigate = useNavigate();
    const [markers, setMarkers] = useState([]);
    const [userType, setUserType] = useState('1');
    const [users, setUsers] = useState([]);
    const [usersRanking, setUsersRanking] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visibleBtns, setVisibleBtns] = useState(true)

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        const div = document.querySelector('#div-main-scroll')
        div.addEventListener('scroll', (e) => {
            if (e.srcElement.scrollTop > 30) {
                setVisibleBtns(false);
            } else {
                setVisibleBtns(true);
            }
        })
    }, []);

    useEffect(() => {
        getUsersRanking();
    }, [userType]);

    async function getUsers() {
        let newArray = [];

        const response = await api.get('/users');
        const users = response.data.users;

        for (var i = 0; i < users.length; i++) {
            if (users[i].userType === 1) {
                if (users[i].geoLocation) {
                    if (users[i].accountStatus === 'blockchain') {
                        newArray.push(users[i])
                    }
                }
            }
        }

        setMarkers(newArray);
    }

    async function getUsersRanking() {
        setLoading(true);
        setUsersRanking([])
        if (userType === '1') {
            const response = await api.get('/web3/producers');
            setUsersRanking(response.data.producers);
        }
        if (userType === '2') {
            const response = await api.get('/web3/inspectors');
            setUsersRanking(response.data.inspectors);
        }
        if (userType === '3') {
            const response = await api.get('/web3/researchers');
            setUsersRanking(response.data.researchers);
        }
        if (userType === '4') {
            const response = await api.get('/web3/developers');
            setUsersRanking(response.data.developers);
        }
        if (userType === '6') {
            const response = await api.get('/web3/activists');
            setUsersRanking(response.data.activists);
        }
        if (userType === '7') {
            const response = await api.get('/web3/investors');
            setUsersRanking(response.data.investors);
        }
        if (userType === '8') {
            const response = await api.get('/web3/validators');
            setUsersRanking(response.data.validators);
        }
        setLoading(false);
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh] overflow-hidden`} >
            <TopBar />
            <Header routeActive='community' />

            <div className="flex flex-col overflow-scroll" id="div-main-scroll">
                <div className="flex flex-col items-center w-full pt-10 lg:pt-28" >
                    <div className="flex w-full h-[440px]">
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

                                    return (
                                        <Marker
                                            position={{ lat: location?.latitude, lng: location?.longitude }}
                                        />
                                    )
                                })}
                            </GoogleMap>
                        </LoadScript>
                    </div>

                    <div className={`absolute flex flex-col w-[210px] gap-2 lg:top-36 top-28 duration-300 ${visibleBtns ? 'left-3' : 'left-[-250px]'}`}>
                        <button
                            className="w-full h-12 p-2 rounded-md bg-green-800 shadow-md flex items-center justify-between"
                            onClick={() => setUserType('1')}
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
                            onClick={() => setUserType('2')}
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
                            onClick={() => setUserType('3')}
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
                            onClick={() => setUserType('4')}
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
                            onClick={() => setUserType('6')}
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
                            onClick={() => setUserType('8')}
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
                            onClick={() => setUserType('7')}
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

                <div className="flex flex-col pb-20 lg:pb-5 px-3">
                    <h1 className="font-bold text-white text-xl mt-3 text-center mb-1">
                        {userType === '1' && 'Produtores'}
                        {userType === '2' && 'Inspetores'}
                        {userType === '3' && 'Pesquisadores'}
                        {userType === '4' && 'Desenvolvedores'}
                        {userType === '5' && 'Contribuidores'}
                        {userType === '6' && 'Ativista'}
                        {userType === '7' && 'Apoiadores'}
                        {userType === '8' && 'Validadores'}
                    </h1>

                    {loading && (
                        <ActivityIndicator size={50} />
                    )}

                    <div className="flex gap-3 justify-center flex-wrap">
                        {usersRanking.map(item => (
                            <UserRankingItem
                                data={item}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex">
                <Feedback />
            </div>
        </div>
    )
}