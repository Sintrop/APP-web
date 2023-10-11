import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import { useMainContext } from '../../hooks/useMainContext';
import { useTranslation } from 'react-i18next';

import { providers, ethers } from 'ethers'; 
import detectEthereumProvider from '@metamask/detect-provider'; 
import { SwapWidget } from '@uniswap/widgets';

import Loading from '../Loading';
import {FaAngleDown} from 'react-icons/fa';
import {BiTransferAlt} from 'react-icons/bi';
import {Warning} from '../Warning';
import { BackButton } from '../BackButton';

const jsonRpcEndpoint = `https://sepolia.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`;
const jsonRpcProvider = new providers.JsonRpcProvider(jsonRpcEndpoint);  
const provider = new ethers.providers.Web3Provider(jsonRpcProvider);

export function Market({setTab}){
    const {t} = useTranslation();
    const {typeUser, tabActive, walletSelected} = useParams();
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState({  
        address: '',  
        provider: provider,  
    })

    useEffect(() => {
        setTab(tabActive, '');
    }, [tabActive]);

    useEffect(() => {

    },[])

    async function connectWallet() {  
        const ethereumProvider = await detectEthereumProvider();  if (ethereumProvider) {   
            const accounts = await window.ethereum.request({  
                method: 'eth_requestAccounts',  
            })     
            const address = accounts[0];     
            setAccount({  
                address: address,  
                provider: ethereumProvider  
            })  
        }  
    }  

    return(
        <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-2 lg:pt-10 overflow-auto h-[95vh] pb-20'>
            <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-2'> 
                <div className='flex items-center gap-2'>
                    <BackButton/>
                    <h1 className='font-bold text-lg lg:text-2xl text-white'>{t('Market')}</h1>
                </div>
            </div>

            <Warning
                message='Under development'
                width={200}
            />

            <div className='my-5'>
                <SwapWidget  
                    provider={account.provider}  
                    JsonRpcEndpoint={jsonRpcEndpoint} 
                    
                />  
            </div>

            {/* <div className='flex flex-col lg:w-[500px] rounded-lg bg-[#0a4303] p-3 mt-5'>
                <div className='flex items-center justify-between'>
                    <p className='font-bold text-white'>Swap</p>
                </div>

                <div className='flex flex-col w-full mt-3'>
                    <div className='flex w-full rounded-lg justify-between bg-green-900 p-2'>
                        <input
                            value={0}
                            className='bg-transparent text-gray-300 text-4xl w-[70%]'
                        />

                        <div className='flex flex-col items-end gap-1'>
                            <div className='flex items-center gap-1 bg-green-800 rounded-md px-2 py-1 cursor-pointer'>
                                <img
                                    src={require('../../assets/eth-icon.png')}
                                    className='w-7 object-contain bg-white rounded-full p-1'
                                />
                                <p className='font-bold text-white text-xl'>ETH</p>
                                <FaAngleDown size={20} color='white'/>
                            </div>
                            <p className='text-gray-400'>Balance: 0</p>
                        </div>
                    </div>

                    <div className='flex justify-center w-full mt-[-15px] z-50'>
                        <button className='flex p-1 items-center justify-center border-2 bg-green-800 rounded-lg'>
                            <BiTransferAlt size={25} color='white'/>
                        </button>
                    </div>

                    <div className='flex w-full rounded-lg justify-between bg-green-900 p-2 mt-[-15px] z-40'>
                        <input
                            value={0}
                            className='bg-transparent text-gray-300 text-4xl w-[70%]'
                        />

                        <div className='flex flex-col items-end gap-1'>
                            <div className='flex items-center gap-1 bg-green-800 rounded-md px-2 py-1 cursor-pointer'>
                                <img
                                    src={require('../../assets/token.png')}
                                    className='w-7 object-contain'
                                />
                                <p className='font-bold text-white text-xl'>RCT</p>
                                <FaAngleDown size={20} color='white'/>
                            </div>
                            <p className='text-gray-400'>Balance: 0</p>
                        </div>
                    </div>
                </div>

                <button
                    className='font-bold text-white text-xl bg-[#ff9900] hover:bg-[#cc851a] w-full py-3 rounded-lg duration-200 mt-5'
                    onClick={() => {}}
                >
                    Swap
                </button>
            </div> */}

            {/* <a className='flex items-center justify-center px-3 py-1 rounded-md bg-white w-60 mt-3' href='https://uniswap.org/' target='_blank'>
                <p className='font-bold text-black'>powered by</p>
                <img
                    src={require('../../assets/logo-uniswap.png')}
                    className='w-10 object-contain'
                />
                <p className='font-bold text-pink-600'>UNISWAP</p>
            </a> */}
            
            {loading && (
                <Loading/>
            )}
        </div>
    )
}