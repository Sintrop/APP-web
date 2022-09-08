import React, {useState, useEffect} from 'react';
import './itemsListIsa.css';

//components
import DetailsCategoryIsa from '../DetailsCategoryIsa';
import VoteCategory from '../VoteCategory';
import Loading from '../../Loading';

//services
import {IsVoted, GetTokensCategory} from '../../../services/voteService';

export default function ItemsListISA({data, walletAddress, reloadCategories}){
    const [showDetails, setShowDetails] = useState(false);
    const [showVoteCard, setShowVoteCard] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categoryVoted, setCategoryVoted] = useState(false);
    const [typeModal, setTypeModal] = useState('vote');
    const [tokens, setTokens] = useState('0');

    useEffect(() => {
        checkIsVoted();
        getTokensCategory();
    },[])

    async function checkIsVoted(){
        const response = await IsVoted(walletAddress, data.id);
        if(parseFloat(response) > 0){
            setCategoryVoted(true);
        }else{
            setCategoryVoted(false);
        }
    }

    async function getTokensCategory(){
        const response = await GetTokensCategory(data.id);
        setTokens(response);
    }


    return(
        <tr key={data.id}>
            <td id='createdByContentIsa'>
                <button
                    onClick={() => setShowDetails(true)}
                >
                    ...
                </button>
                <p>{data.createdBy}</p>    
            </td>
            <td>
                <p>
                    {data.name}
                </p>
            </td>
            <td>
                <p className='p-description-category-isa'>
                    {data.description}
                </p>    
            </td>
            <td>{tokens}</td>
            <td id='td-vote-table-isa'>
                {categoryVoted && (
                    <button
                        onClick={() => {
                            setTypeModal('unvote')
                            setShowVoteCard(true)
                        }}
                        className='btn-unvote'
                    >
                        Unvote
                    </button>
                )}
                <button
                    onClick={() => {
                        setTypeModal('vote')
                        setShowVoteCard(true)
                    }}
                    className='btn-vote'
                >
                    + Vote
                </button>
            </td>

            {showDetails && (
                <DetailsCategoryIsa 
                    data={data}
                    close={() => setShowDetails(false)}
                />
            )}

            {showVoteCard && (
                <VoteCategory
                    close={() => setShowVoteCard(false)}
                    walletAddress={walletAddress}
                    data={data}
                    reloadCategories={() => reloadCategories()}
                    type={typeModal}
                />
            )}

            {loading && (
                <Loading/>
            )}
        </tr>
    )
}