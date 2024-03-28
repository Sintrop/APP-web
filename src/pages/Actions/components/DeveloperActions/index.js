import React, {useState, useEffect} from "react";
import { api } from "../../../../services/api";
import {ActivityIndicator} from '../../../../components/ActivityIndicator';
import { FeedbackItem } from "./feedbackItem";
import { useMainContext } from "../../../../hooks/useMainContext";

export function DeveloperActions(){
    const {userData} = useMainContext();
    const [loading, setLoading] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [historyFeedbacks, setHistoryFeedbacks] = useState([]);

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

    return(
        <div className="flex flex-col w-[800px]">
            <h3 className="font-bold text-white text-lg">Centro de desenvolvimento</h3>

            <div className="flex flex-col p-2 bg-[#0a4303] rounded-md mt-5">
                <p className="text-gray-400">Relatório de desenvolvimento</p>
                <button
                    className="font-bold text-white px-3 py-1 rounded-md bg-blue-500 w-fit mt-1"
                >
                    Enviar relatório
                </button>
            </div>

            <p className="text-gray-400 mt-5">Feedbacks/tasks</p>
            {loading && (
                <ActivityIndicator size={50}/>
            )}
            {feedbacks.map(item => (
                <FeedbackItem
                    key={item.id}
                    data={item}
                    userData={userData}
                />
            ))}
        </div>
    )
}