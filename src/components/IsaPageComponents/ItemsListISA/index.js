import React, {useState, useEffect} from 'react';
import './itemsListIsa.css';
import { useNavigate } from 'react-router-dom';
//components
import DetailsCategoryIsa from '../DetailsCategoryIsa';
import VoteCategory from '../VoteCategory';
import Loading from '../../Loading';

//services
import {IsVoted, GetTokensCategory} from '../../../services/voteService';

export default function ItemsListISA({data, walletAddress, reloadCategories, setTab}){
    const navigate = useNavigate();
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
            <td>
                <button
                    onClick={() => setShowDetails(true)}
                    className='btn-details-isa'
                >
                    ...
                </button>
            </td>
            <td id='createdByContentIsa'>
                <a 
                    style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}} 
                    onClick={() => {
                        navigate(`/dashboard/${walletAddress}/researcher-page/${data.createdBy}`)
                    }}
                >
                    <p>{data.createdBy}</p>    
                </a>
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
                    Vote
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