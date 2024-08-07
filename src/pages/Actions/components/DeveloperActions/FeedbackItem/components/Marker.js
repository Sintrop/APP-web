import React from 'react';
import {HiClipboardList} from 'react-icons/hi';
import {VscFeedback, VscDeviceMobile} from 'react-icons/vsc';
import {MdMonitor, MdDesignServices} from 'react-icons/md';
import {SiHiveBlockchain} from 'react-icons/si';
import {TbUserCheck, TbMoodNervous} from 'react-icons/tb';
import {GrNode} from 'react-icons/gr';
import {RiEmotionHappyLine} from 'react-icons/ri';
import {ImAngry} from 'react-icons/im';

export function Marker({type, active}){
    if(type === 'feedback'){
        return(
            <div className='flex px-2 h-9 items-center justify-center rounded-md border-2 border-green-800 gap-1'>
                <VscFeedback color='green' size={20}/>
                <p className='text-green-700 font-bold text-sm'>Feedback</p>
            </div>
        )
    }

    if(type === 'task'){
        return(
            <div className='flex px-2 h-9 items-center justify-center rounded-md border-2 border-green-800 gap-1'>
                <HiClipboardList color='green' size={20}/>
                <p className='text-green-700 font-bold text-sm'>Task</p>
            </div>
        )
    }

    if(type === 'frontend'){
        return(
            <div className={`flex px-2 h-9 items-center justify-center rounded-md border-2 border-blue-500 ${active && 'bg-blue-500'} gap-1`}>
                <MdMonitor className='text-blue-500' size={20}/>
                <p className='text-blue-500 font-bold text-sm'>Front-End</p>
            </div>
        )
    }

    if(type === 'contracts'){
        return(
            <div className={`flex px-2 h-9 items-center justify-center rounded-md border-2 border-violet-600 ${active && 'bg-violet-600'} gap-1`}>
                <SiHiveBlockchain className='text-violet-600' size={20}/>
                <p className='text-violet-600 font-bold text-sm'>Smart Contracts</p>
            </div>
        )
    }

    if(type === 'mobile'){
        return(
            <div className={`flex px-2 h-9 items-center justify-center rounded-md border-2 border-lime-400 ${active && 'bg-lime-400'} gap-1`}>
                <VscDeviceMobile className='text-lime-400' size={20}/>
                <p className='text-lime-400 font-bold text-sm'>Mobile</p>
            </div>
        )
    }

    if(type === 'design'){
        return(
            <div className={`flex px-2 h-9 items-center justify-center rounded-md border-2 border-purple-800 ${active && 'bg-purple-800'} gap-1`}>
                <MdDesignServices className='text-purple-800' size={20}/>
                <p className='text-purple-800 font-bold text-sm'>Design</p>
            </div>
        )
    }

    if(type === 'ux'){
        return(
            <div className={`flex px-2 h-9 items-center justify-center rounded-md border-2 border-purple-800 ${active && 'bg-purple-800'} gap-1`}>
                <TbUserCheck className='text-purple-800' size={20}/>
                <p className='text-purple-800 font-bold text-sm'>User Experience</p>
            </div>
        )
    }

    if(type === 'api'){
        return(
            <div className={`flex px-2 h-9 items-center justify-center rounded-md border-2 border-green-800 ${active && 'bg-green-800'} gap-1`}>
                <GrNode className='text-green-800' size={20}/>
                <p className='text-green-800 font-bold text-sm'>API</p>
            </div>
        )
    }

    if(type === 'low'){
        return(
            <div className='flex px-2 h-9 items-center justify-center rounded-md border-2 border-green-500 gap-1'>
                <RiEmotionHappyLine className='text-green-500' size={20}/>
                <p className='text-green-500 font-bold text-sm'>Low Priority</p>
            </div>
        )
    }

    if(type === 'average'){
        return(
            <div className='flex px-2 h-9 items-center justify-center rounded-md border-2 border-yellow-400 gap-1'>
                <TbMoodNervous className='text-yellow-400' size={20}/>
                <p className='text-yellow-400 font-bold text-sm'>Average Priority</p>
            </div>
        )
    }

    if(type === 'high'){
        return(
            <div className='flex px-2 h-9 items-center justify-center rounded-md border-2 border-red-500 gap-1'>
                <ImAngry className='text-red-500' size={20}/>
                <p className='text-red-500 font-bold text-sm'>High Priority</p>
            </div>
        )
    }

    if(type === 'all'){
        return(
            <div className={`flex px-2 h-9 items-center justify-center rounded-md border-2 border-gray-700 ${active && 'bg-gray-700'} gap-1`}>
                <p className='text-white font-bold text-sm'>Todos</p>
            </div>
        )
    }
}