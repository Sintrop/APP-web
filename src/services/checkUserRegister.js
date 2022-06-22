import Web3 from 'web3';
import UserContract from '../data/contracts/abis/UserContract.json';
import { useCallback, useEffect, useState } from 'react';

function CheckUserRegister({walletAddress}) {
    const contractAddress = UserContract.networks[5777].address
    const [user, setUser] = useState(null);

    const getUser = useCallback(async () => {
        try{
            //Connection web3
            const web3 = new Web3(window.ethereum);

            //Connection contract
            const contract = new web3.eth.Contract(UserContract.abi, contractAddress);
            contract.methods.getUser(walletAddress).call({from: contractAddress})
            .then((res) => {
                //Response type of user
                setUser('2')
            })
            
        }catch(error){
            //Log errors
        }
    }, [])

    useEffect(() => {
        getUser();
    }, [getUser])

    return {user}
};

export default CheckUserRegister;