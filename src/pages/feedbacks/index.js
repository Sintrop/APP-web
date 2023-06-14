import React, {useEffect, useState} from 'react';
import { api } from '../../services/api';
import { FeedbackItem } from './feedbackItem';

export function Feedbacks(){
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        getFeedbacks()
    },[])

    async function getFeedbacks(){
        try{
            const response = await api.get('/feedback');
            setFeedbacks(response.data.feedbacks)
        }catch(err){
            console.log(err);
        }
    }
    return(
        <div className='flex flex-col items-center p-3'>
            {feedbacks.map(item => (
                <FeedbackItem
                    key={item.id}
                    data={item}
                />
            ))}
        </div>
    )
}