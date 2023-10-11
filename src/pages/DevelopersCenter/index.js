import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router';
import { TopBarStatus } from '../../components/TopBarStatus';
import { useNavigate } from 'react-router';
import * as Dialog from '@radix-ui/react-dialog';
import {RankingItem} from '../../components/RankingItem';
import {FaChevronLeft} from 'react-icons/fa';
import { api } from '../../services/api';
import Loader from '../../components/Loader';
import { useTranslation } from 'react-i18next';
import { GetDevelopers } from '../../services/developersPoolService';
import { GetDevelopersInfura } from '../../services/methodsGetInfuraApi';
import { FeedbackItem } from './feedbackItem';
import { ModalCreateTask } from './ModalCreateTask';
import { ToastContainer, toast } from 'react-toastify';
import { Marker } from './Marker';
import { useMainContext } from '../../hooks/useMainContext';

export function DevelopersCenter(){
    const navigate = useNavigate();
    const {t} = useTranslation();
    const {viewMode} = useMainContext();
    const [loading, setLoading] = useState(true);
    const {walletAddress, typeUser} = useParams();
    const [tabSelected, setTabSelected] = useState('feedbacks');
    const [devs, setDevs] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [allFeedbacks, setAllFeedbacks] = useState([]);
    const [feedbacksFinished, setFeedbacksFinished] = useState([]);
    const [userData, setUserData] = useState({});
    const [modalCreateTask, setModalCreateTask] = useState(false);
    const [filterSelected, setFilterSelected] = useState('all');

    useEffect(() => {
        getUser();
        if(tabSelected === 'developers'){
            getDevelopers();
        }
        if(tabSelected === 'feedbacks'){
            getFeedbacks();
        }
    },[tabSelected]);

    useEffect(() => {
        filterTask();
    },[filterSelected]);

    async function getDevelopers(){
        setLoading(true);
        if(viewMode){
            const response = await GetDevelopersInfura();
            setDevs(response);
        }else{
            const response = await GetDevelopers();
            setDevs(response);
        }
        setLoading(false);
    }

    async function getFeedbacks(){
        try{
            setLoading(true);
            const response = await api.get('/feedback');
           
            const responseFeedbacks = response.data.feedbacks;
            const feedbacksNotFinished = responseFeedbacks.filter(item => item.status !== 4);
            const feedbacksFinished = responseFeedbacks.filter(item => item.status === 4);
            setFeedbacks(feedbacksNotFinished);
            setAllFeedbacks(feedbacksNotFinished);
            setFeedbacksFinished(feedbacksFinished);
            setFilterSelected('all');
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    async function getUser(){
        try{
            const response = await api.get(`/user/${walletAddress}`);
            setUserData(response.data.user)
        }catch(err){

        }finally{

        }
    }

    function filterTask(){
        let feedbacksFiltered = []
        if(filterSelected === 'all'){
            setFeedbacks(allFeedbacks);
            return;
        }
        for(var i = 0; i < allFeedbacks.length; i++){
            if(filterSelected === 'frontend'){
                if(allFeedbacks[i].team === 1){
                    feedbacksFiltered.push(allFeedbacks[i]);
                }
            }
            if(filterSelected === 'contracts'){
                if(allFeedbacks[i].team === 2){
                    feedbacksFiltered.push(allFeedbacks[i]);
                }
            }
            if(filterSelected === 'mobile'){
                if(allFeedbacks[i].team === 3){
                    feedbacksFiltered.push(allFeedbacks[i]);
                }
            }
            if(filterSelected === 'design'){
                if(allFeedbacks[i].team === 4){
                    feedbacksFiltered.push(allFeedbacks[i]);
                }
            }
            if(filterSelected === 'ux'){
                if(allFeedbacks[i].team === 5){
                    feedbacksFiltered.push(allFeedbacks[i]);
                }
            }
            if(filterSelected === 'api'){
                if(allFeedbacks[i].team === 6){
                    feedbacksFiltered.push(allFeedbacks[i]);
                }
            }
        }

        setFeedbacks(feedbacksFiltered);
    }

    return(
        <div className="w-full h-full flex flex-col bg-centro-dev scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-700">
            <TopBarStatus />

            <div className="flex mt-12 bg-black/30">
                <div className="flex flex-col w-[350px] h-[93.4vh]">
                    <div className="bg-black h-full">
                    <img
                        src={require('../../assets/logo-branco.png')}
                        className='w-[150px] object-contain mt-5 ml-5'
                    />

                    <button
                        onClick={() => navigate(`/dashboard/${walletAddress}/network-impact/${typeUser}/main`)}
                        className='flex items-center gap-2 my-3 px-4 text-[#FFC633] font-bold'
                    >
                        <FaChevronLeft size={25} color='#FFC633'/>
                        {t('Back to platform')}
                    </button>

                    <div
                        className='flex items-center px-5 gap-3 mb-3'
                    >
                        <img
                            className='w-[40px] h-[40px] object-contain'
                            src={require('../../assets/icon-dev-1.png')}
                        />
                        <p className='font-bold text-[#FFC633]'>{t('Development Center')}</p>
                    </div>

                    <button
                        onClick={() => setTabSelected('feedbacks')}
                        className={`flex items-center px-5 w-full font-bold text-[#FFC633] h-12 ${tabSelected === 'feedbacks' && 'bg-[#747474]'}`}
                    >
                        {t('Feedbacks and Tasks')}
                    </button>
                    <button
                        onClick={() => setTabSelected('developers')}
                        className={`flex items-center px-5 w-full font-bold text-[#FFC633] h-12 ${tabSelected === 'developers' && 'bg-[#747474]'}`}
                    >
                        {t('Developers')}
                    </button>
                    <button
                        onClick={() => setTabSelected('completed')}
                        className={`flex items-center px-5 w-full font-bold text-[#FFC633] h-12 ${tabSelected === 'completed' && 'bg-[#747474]'}`}
                    >
                        {t('Completed')}
                    </button>
                    
                    </div>
                </div>  

                {loading ? (
                    <div className="flex w-full h-screen items-center justify-center">
                        <Loader
                            type='hash'
                            color='#FFC633'
                        />
                    </div>
                ) : (
                    <div className="w-full flex flex-col">
                        {tabSelected === 'developers' && (
                            <div className="w-full flex flex-col">
                                <div className="w-full flex items-center justify-between h-16 bg-[#313131] px-5">
                                    <div className='flex items-center gap-2'>
                                        <img
                                            src={require('../../assets/icon-dev-2.png')}
                                            className='w-[50px] h-[50px] object-contain'
                                        />
                                        <h1 className='font-bold text-white text-lg'>{t('Developers')}</h1>
                                    </div>
                                </div>

                                <div className="w-full flex h-[80vh] flex-wrap gap-5 overflow-auto px-5 mt-3">
                                    {devs.length > 0 && (
                                        <>
                                        {devs.map((item, index) => (
                                            <RankingItem
                                                data={item}
                                                position={index + 1}
                                                developersCenter
                                            />
                                        ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {tabSelected === 'feedbacks' && (
                            <div className="w-full flex flex-col">
                                <div className="w-full flex items-center justify-between h-16 bg-[#313131] px-5">
                                    <div className='flex items-center gap-2'>
                                        <img
                                            src={require('../../assets/icon-feedback.png')}
                                            className='w-[50px] h-[50px] object-contain'
                                        />
                                        <h1 className='font-bold text-white text-lg'>{t('Feedbacks')}</h1>
                                    </div>
                                    
                                    {typeUser === '4' && (
                                        <button 
                                            className='px-3 py-2 rounded-md bg-[#ff9900] text-white font-bold'
                                            onClick={() => setModalCreateTask(true)}
                                        >
                                            Create Task
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 px-5 mt-2">
                                    <button onClick={() => setFilterSelected('all')}>
                                        <Marker
                                            type='all'
                                            active={filterSelected === 'all'}
                                        />
                                    </button>
                                    <button onClick={() => setFilterSelected('frontend')}>
                                        <Marker
                                            type='frontend'
                                            active={filterSelected === 'frontend'}
                                        />
                                    </button>
                                    <button onClick={() => setFilterSelected('contracts')}>
                                        <Marker
                                            type='contracts'
                                            active={filterSelected === 'contracts'}
                                        />
                                    </button>
                                    <button onClick={() => setFilterSelected('mobile')}>
                                        <Marker
                                            type='mobile'
                                            active={filterSelected === 'mobile'}
                                        />
                                    </button>
                                    <button onClick={() => setFilterSelected('design')}>
                                        <Marker
                                            type='design'
                                            active={filterSelected === 'design'}
                                        />
                                    </button>
                                    <button onClick={() => setFilterSelected('ux')}>
                                        <Marker
                                            type='ux'
                                            active={filterSelected === 'ux'}
                                        />
                                    </button>
                                    <button onClick={() => setFilterSelected('api')}>
                                        <Marker
                                            type='api'
                                            active={filterSelected === 'api'}
                                        />
                                    </button>
                                </div>

                                <div className="w-full flex flex-col gap-5 overflow-auto px-5 mt-1 h-[77vh] scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-700">
                                    {feedbacks.map(item => (
                                        <FeedbackItem
                                            key={item.id}
                                            data={item}
                                            userData={userData}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {tabSelected === 'completed' && (
                            <div className="w-full flex flex-col">
                                <div className="w-full flex items-center justify-between h-16 bg-[#313131] px-5">
                                    <div className='flex items-center gap-2'>
                                        <img
                                            src={require('../../assets/icon-dev-2.png')}
                                            className='w-[50px] h-[50px] object-contain'
                                        />
                                        <h1 className='font-bold text-white text-lg'>{t('Completed')}</h1>
                                    </div>
                                </div>

                                <div className="w-full flex flex-col gap-5 overflow-auto px-5 mt-1 h-[84vh] scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-700">
                                    {feedbacksFinished.length > 0 && (
                                        <>
                                        {feedbacksFinished.map((item) => (
                                            <FeedbackItem
                                                key={item.id}
                                                data={item}
                                                userData={userData}
                                            />
                                        ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Dialog.Root
                open={modalCreateTask}
                onOpenChange={(open) => setModalCreateTask(open)}
            >
                <ModalCreateTask
                    userData={userData}
                    close={(newTask) => {
                        setModalCreateTask(false);
                        toast.success('Task created successfully');
                        getFeedbacks()
                    }}
                />
            </Dialog.Root>

            <ToastContainer
                position='top-center'
            />
        </div>
    )
}