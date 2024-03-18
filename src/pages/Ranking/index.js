import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { api } from "../../services/api";
import { useParams } from "react-router";
import { ActivityIndicator } from '../../components/ActivityIndicator';
import { UserRankingItem } from "./components/UserRankingItem";

export function Ranking() {
    const { userType } = useParams();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    async function getUsers() {
        setLoading(true);
        if (userType === '1') {
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
        <div className={`bg-[#062c01] flex flex-col h-[100vh] overflow-hidden`}>
            <Header />

            <div className="flex flex-col items-center w-full mt-20 overflow-auto">
                <h1 className="font-bold text-white text-xl mt-3">
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
                    <ActivityIndicator size={40} />
                )}
                
                <div className="flex gap-3 flex-wrap max-w-[1024px] mt-3 justify-center">

                    {users.map(item => (
                        <UserRankingItem
                            data={item}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}