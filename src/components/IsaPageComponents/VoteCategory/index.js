import React, {useState, useEffect} from 'react';
import '../CreateCategory/createCategory.css';
import './voteCategory.css';

//components
import Loading from '../../Loading';

//services
import {Vote, Unvote, GetTokensBalance} from '../../../services/voteService';

export default function VoteCategory({close, walletAddress, data, reloadCategories, type}){
    const [tokensBalance, setTokensBalance] = useState(0);
    const [sendTokens, setSendTokens] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(type === 'vote'){
            getBalance();
        }
    }, [])

    async function getBalance(){
        const balance = await GetTokensBalance(walletAddress);
        setTokensBalance(balance);
    }

    function validatesAmount(){
        if(sendTokens > parseFloat(tokensBalance) || sendTokens < 1){
            alert('Invalid value!');
        }else{
            vote();
        }
    }

    async function vote(){
        setLoading(true);
        await Vote(data.id, parseFloat(sendTokens), walletAddress);
        setLoading(false);
        reloadCategories();
        close();
    }

    async function unVote(){
        setLoading(true);
        await Unvote(data.id, walletAddress);
        setLoading(false);
        reloadCategories();
        close();
    }

    return(
        <div className="container-create-category">
            <div className="card-vote-category">
                <div className="header-create-category">
                    <p className='tit-categories-isa'>{type === 'vote' ? 'Vote' : 'Unvote'} of Category</p>
                    <button
                        className="btn-close-create-category"
                        onClick={() => close()}
                    >
                        X
                    </button>
                </div>
                <div>
                    {type === 'vote' && (
                        <p className='tit-your-balance'>Your balance: {tokensBalance} SAC Tokens</p>
                    )}

                    {type === 'vote' ? (
                        <p>Amount of tokens you want to vote</p>
                    ) : (
                        <p>Want to withdraw your vote and your tokens from the category?</p>
                    )}
                    {type === 'vote' && (
                        <input 
                            type='number' 
                            value={sendTokens}
                            className='input-amount-tokens-vote'
                            onChange={(e) => setSendTokens(e.target.value)}
                            placeholder='Amount of tokens'
                        />
                    )}

                    {type === 'vote' ? (
                        <button
                            className='btn-vote-of-category'
                            onClick={() => validatesAmount()}
                        >
                            Vote
                        </button>
                    ) : (
                        <button
                            className='btn-unvote-of-category'
                            onClick={() => unVote()}
                        >
                            Unvote
                        </button>
                    )}
                    
                </div>
            </div>

            {loading && (
                <Loading/>
            )}
        </div>
    );
}