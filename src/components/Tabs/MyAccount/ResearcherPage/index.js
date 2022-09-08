import React, {useEffect, useState} from 'react';
import AvatarDefault from '../../../../assets/img/avatar03.png';
import ResearchersService from '../../../../services/researchersService';

export default function ResearcherPage({wallet}){
    const researchersService = new ResearchersService(wallet);
    const [researcherData, setResearcherData] = useState([]);

    useEffect(() => {
        getResearcher();
    },[]);

    async function getResearcher(){
        const response = await researchersService.getResearchers(wallet);
        setResearcherData(response);
    }

    return(
        <div className='container__producer-page'>
            <div className='content__producer-page'>
                <div className='producer-area-info__producer-page'>
                    <div className='area-avatar__producer-page'>
                        <img src={AvatarDefault} className='avatar__producer-page'/>
                        <div className='producer-cards-info__producer-page card-wallet'>
                            <h1 className='tit-cards-info__producer-page'>Researcher Wallet: </h1>
                            <a className='description-cards-info__producer-page' href='#'>
                                {researcherData === [] ? '' : researcherData.researcherWallet}
                            </a>
                        </div>

                        <button
                            className='area-avatar__btn-report'
                        >Report Researcher</button>
                    </div>  

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Name: </h1>
                        <p className='description-cards-info__producer-page'>
                            {researcherData === [] ? '' : researcherData.name}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Address: </h1>
                        <p className='description-cards-info__producer-page'>
                            {researcherData.researcherAddress === undefined ? '' : `${researcherData.researcherAddress.city}/${researcherData.researcherAddress.state}, ${researcherData.researcherAddress.country}`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}