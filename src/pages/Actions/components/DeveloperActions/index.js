import React, { useState, useEffect } from "react";
import { api } from "../../../../services/api";
import { ActivityIndicator } from '../../../../components/ActivityIndicator';
import { FeedbackItem } from "./feedbackItem";
import { useMainContext } from "../../../../hooks/useMainContext";
import { SendReportDev } from '../../../checkout/SendReportDev';
import { UserRankingItem } from "../../../Ranking/components/UserRankingItem";

export function DeveloperActions() {
    const { userData, walletConnected } = useMainContext();
    const [loading, setLoading] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [historyFeedbacks, setHistoryFeedbacks] = useState([]);
    const [modalDevReport, setModalDevReport] = useState(false);
    const [tabSelected, setTabSelected] = useState('open');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if(tabSelected === 'open' || tabSelected === 'history')getFeedbacks();
        if(tabSelected === 'users')getUsers();
    }, [tabSelected]);

    async function getFeedbacks() {
        setLoading(true);
        let openFeedbacks = [];
        let historyFeedbacks = [];

        const response = await api.get('feedback');
        const responseFeedbacks = response.data.feedbacks

        for (var i = 0; i < responseFeedbacks.length; i++) {
            if (responseFeedbacks[i].status === 3 || responseFeedbacks[i].status === 4) {
                historyFeedbacks.push(responseFeedbacks[i]);
            } else {
                openFeedbacks.push(responseFeedbacks[i]);
            }
        }

        setFeedbacks(openFeedbacks);
        setHistoryFeedbacks(historyFeedbacks);

        setLoading(false);
    }

    async function getUsers(){
        setLoading(true);
        const response = await api.get('/web3/developers');
        setUsers(response.data.developers);
        setLoading(false);
    }

    return (
        <div className="flex flex-col lg:w-[1024px]">
            <h3 className="font-bold text-white text-lg">Centro de desenvolvimento</h3>

            {userData?.userType === 4 && (
                <div className="flex flex-col p-2 bg-[#0a4303] rounded-md mt-5">
                    <p className="text-gray-400">Relatório de desenvolvimento</p>
                    <button
                        className="font-bold text-white px-3 py-1 rounded-md bg-blue-500 w-fit mt-1"
                        onClick={() => setModalDevReport(true)}
                    >
                        Enviar relatório
                    </button>
                </div>
            )}

            <p className="text-gray-400 mt-5">Feedbacks/tasks</p>
            <div className="flex items-center gap-8 mb-2">
                <button
                    className={`font-bold py-1 border-b-2 ${tabSelected === 'open' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                    onClick={() => setTabSelected('open')}
                >
                    Abertas
                </button>

                <button
                    className={`font-bold py-1 border-b-2 ${tabSelected === 'history' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                    onClick={() => setTabSelected('history')}
                >
                    Histórico
                </button>

                <button
                    className={`font-bold py-1 border-b-2 ${tabSelected === 'users' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                    onClick={() => setTabSelected('users')}
                >
                    Usuários
                </button>
            </div>
            {loading && (
                <ActivityIndicator size={50} />
            )}

            {tabSelected === 'open' && (
                <>
                    {feedbacks.map(item => (
                        <FeedbackItem
                            key={item.id}
                            data={item}
                            userData={userData}
                        />
                    ))}
                </>
            )}

            {tabSelected === 'history' && (
                <>
                    {historyFeedbacks.map(item => (
                        <FeedbackItem
                            key={item.id}
                            data={item}
                            userData={userData}
                        />
                    ))}
                </>
            )}

            {tabSelected === 'users' && (
                <div className="flex gap-3 flex-wrap max-w-[1024px] mt-3 justify-center">
                    {users.map(item => (
                        <UserRankingItem
                            data={item}
                        />
                    ))}
                </div>
            )}

            {modalDevReport && (
                <SendReportDev
                    close={() => setModalDevReport(false)}
                    walletAddress={walletConnected}
                    userData={userData}
                />
            )}
        </div>
    )
}