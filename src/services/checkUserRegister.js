import { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import UserContractJson from '../data/contracts/abis/UserContract.json';
const web3 = new Web3(window.ethereum);

const userContractAddress = process.env.REACT_APP_USER_CONTRACT_ADDRESS
const UserContract = new web3.eth.Contract(UserContractJson, userContractAddress)

function CheckUserRegister({walletAddress}) {
    const [user, setUser] = useState(null);

    const getUser = useCallback(async () => {
        try{
            UserContract.methods.getUser(walletAddress).call({from: userContractAddress})
            .then((res) => {
                //Response type of user
                setUser(res)
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

export const CheckUser = async (walletAddress) => {
    let user = '';
    await UserContract.methods.getUser(walletAddress).call({from: userContractAddress})
    .then((res) => {
        user = res;
    })
    return user;
}