import React, { useEffect, useState } from "react";
import { Header } from "../../../components/Header";
import { api } from "../../../services/api";
import { useParams } from "react-router";
import { ActivityIndicator } from '../../../components/ActivityIndicator';
import { UserRankingItem } from "./components/UserRankingItem";
import { TopBar } from "../../../components/TopBar";
import ReactMapGL, { Layer, Marker, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export function Ranking() {
    const { userType } = useParams();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [mapCommunity, setMapCommunity] = useState({ latitude: -11.680854, longitude: -51.9245419 });
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    async function getProducersApi() {
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

    async function getUsers() {
        setLoading(true);
        if (userType === '1') {
            getProducersApi();
            const response = await api.get('/web3/producers');
            setUsers(response.data.producers);
        }
        if (userType === '2') {
            const response = await api.get('/web3/inspectors');
            setUsers(response.data.inspectors);
        }
        if (userType === '3') {
            const response = await api.get('/web3/researchers');
            setUsers(response.data.researchers);
        }
        if (userType === '4') {
            const response = await api.get('/web3/developers');
            setUsers(response.data.developers);
        }
        if (userType === '6') {
            const response = await api.get('/web3/activists');
            setUsers(response.data.activists);
        }
        if (userType === '7') {
            const response = await api.get('/web3/investors');
            setUsers(response.data.investors);
        }
        if (userType === '8') {
            const response = await api.get('/web3/validators');
            setUsers(response.data.validators);
        }
        setLoading(false);
    }

    return (
        <div className={`bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col h-[100vh] overflow-hidden relative`}>
            <TopBar />
            <Header />

            <div className="flex flex-col w-full pt-28 overflow-auto">
                <h1 className="font-bold text-white text-xl mt-3 absolute left-5 top-[130px] z-50">
                    {userType === '1' && 'Produtores'}
                    {userType === '2' && 'Inspetores'}
                    {userType === '3' && 'Pesquisadores'}
                    {userType === '4' && 'Desenvolvedores'}
                    {userType === '5' && 'Contribuidores'}
                    {userType === '6' && 'Ativista'}
                    {userType === '7' && 'Apoiadores'}
                    {userType === '8' && 'Validadores'}
                </h1>

                {userType === '1' && (
                    <div className="flex w-full h-[440px] bg-espaco2 bg-center bg-cover bg-no-repeat">
                        {mapCommunity && (
                            <ReactMapGL
                                style={{ width: '100%', height: '100%' }}
                                mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
                                mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESSTOKEN}
                                latitude={mapCommunity?.latitude}
                                longitude={mapCommunity?.longitude}
                                onDrag={(e) => {
                                    setMapCommunity({ latitude: e.viewState.latitude, longitude: e.viewState.longitude })
                                }}
                                minZoom={1}
                                projection='globe'
                                fog={{}}
                            >

                                {userType === '1' && (
                                    <>
                                        {markers.length > 0 && (
                                            <>
                                                {markers.map(item => {
                                                    const coord = JSON.parse(item?.geoLocation)
                                                    if (coord?.latitude) {
                                                        return (
                                                            <Marker latitude={coord?.latitude} longitude={coord?.longitude} color="red" key={item.id} />
                                                        )
                                                    }
                                                })}
                                            </>
                                        )}
                                    </>
                                )}

                            </ReactMapGL>
                        )}
                    </div>
                )}

                {loading && (
                    <div className="mt-20">
                        <ActivityIndicator size={180} />
                    </div>
                )}

                <div className={`flex gap-3 flex-wrap w-full mt-3 px-5 ${userType !== '1' && 'mt-36'}`}>
                    {users.map(item => (
                        <UserRankingItem
                            data={item}
                            key={item.id}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}