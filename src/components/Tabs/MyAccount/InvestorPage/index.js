import React, {useEffect, useState} from 'react';
import AvatarDefault from '../../../../assets/img/avatar03.png';
import InvestorService from '../../../../services/investorService';

export default function InvestorPage({wallet}){
    const investorService = new InvestorService(wallet)
    const [investorData, setInvestorData] = useState([]);

    useEffect(() => {
        getInvestor();
    },[]);

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

                        <button
                            className='area-avatar__btn-report'
                        >Report Investor</button>
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