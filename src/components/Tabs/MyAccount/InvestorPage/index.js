import React, {useEffect, useState} from 'react';
import AvatarDefault from '../../../../assets/img/avatar03.png';
import InvestorService from '../../../../services/investorService';
import * as Dialog from '@radix-ui/react-dialog';
import ModalDelation from '../../../ModalDelation';
import {useParams} from 'react-router-dom';


export default function InvestorPage({wallet, setTab}){
    const investorService = new InvestorService(wallet)
    const [investorData, setInvestorData] = useState([]);
    const {tabActive} = useParams();

    useEffect(() => {
        getInvestor();
    },[]);

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    async function getInvestor(){
        const response = await investorService.getInvestor(wallet);
        setInvestorData(response);
    }

    return(
        <div className='container__producer-page'>
            <div className='content__producer-page'>
                <div className='producer-area-info__producer-page'>
                    <div className='area-avatar__producer-page'>
                        <img src={AvatarDefault} className='avatar__producer-page'/>
                        <div className='producer-cards-info__producer-page card-wallet'>
                            <h1 className='tit-cards-info__producer-page'>Investor Wallet: </h1>
                            <a className='description-cards-info__producer-page' href='#'>
                                {investorData === [] ? '' : investorData.investorWallet}
                            </a>
                        </div>

                        <Dialog.Root>
                            <Dialog.Trigger className='area-avatar__btn-report'>
                                Report Investor
                            </Dialog.Trigger>
                            <ModalDelation reportedWallet={wallet}/>
                        </Dialog.Root>
                    </div>  

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Name: </h1>
                        <p className='description-cards-info__producer-page'>
                            {investorData === [] ? '' : investorData.name}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Address: </h1>
                        <p className='description-cards-info__producer-page'>
                            {investorData.investorAddress === undefined ? '' : `${investorData.investorAddress.city}/${investorData.investorAddress.state}, ${investorData.investorAddress.country}`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}