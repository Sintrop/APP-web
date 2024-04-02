import React, { useState, useEffect } from "react";
import { api } from "../../../../services/api";
import { ActivityIndicator } from '../../../../components/ActivityIndicator';
import { FeedbackItem } from "./feedbackItem";
import { useMainContext } from "../../../../hooks/useMainContext";
import { SendReportDev } from '../../../checkout/SendReportDev';

export function DeveloperActions() {
    const { userData, walletConnected } = useMainContext();
    const [loading, setLoading] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [historyFeedbacks, setHistoryFeedbacks] = useState([]);
    const [modalDevReport, setModalDevReport] = useState(false);
    const [tabSelected, setTabSelected] = useState('open')

    useEffect(() => {
        getFeedbacks();
    }, []);

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

    return (
        <div className="flex flex-col w-[800px]">
            <h3 className="font-bold text-white text-lg">Centro de desenvolvimento</h3>

            <div className="flex flex-col p-2 bg-[#0a4303] rounded-md mt-5">
                <p className="text-gray-400">Relatório de desenvolvimento</p>
                <button
                    className="font-bold text-white px-3 py-1 rounded-md bg-blue-500 w-fit mt-1"
                    onClick={() => setModalDevReport(true)}
                >
                    Enviar relatório
                </button>
            </div>

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