import React, {useEffect, useState} from 'react';
import AvatarDefault from '../../../../assets/img/avatar03.png';
import ContributorsService from '../../../../services/contributorService';

export default function ContributorPage({wallet}){
    const contributorService = new ContributorsService(wallet)
    const [contributorData, setContributorData] = useState([]);

    useEffect(() => {
        getContributor();
    },[]);

    async function getContributor(){
        const response = await contributorService.getContributors(wallet);
        setContributorData(response);
    }

    return(
        <div className='container__producer-page'>
            <div className='content__producer-page'>
                <div className='producer-area-info__producer-page'>
                    <div className='area-avatar__producer-page'>
                        <img src={AvatarDefault} className='avatar__producer-page'/>
                        <div className='producer-cards-info__producer-page card-wallet'>
                            <h1 className='tit-cards-info__producer-page'>Contributor Wallet: </h1>
                            <a className='description-cards-info__producer-page' href='#'>
                                {contributorData === [] ? '' : contributorData.contributorWallet}
                            </a>
                        </div>

                        <button
                            className='area-avatar__btn-report'
                        >Report Contributor</button>
                    </div>  

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Name: </h1>
                        <p className='description-cards-info__producer-page'>
                            {contributorData === [] ? '' : contributorData.name}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Address: </h1>
                        <p className='description-cards-info__producer-page'>
                            {contributorData.contributorAddress === undefined ? '' : `${contributorData.contributorAddress.city}/${contributorData.contributorAddress.state}, ${contributorData.contributorAddress.country}`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}