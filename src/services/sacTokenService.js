import { RcTokenContract } from "./web3/Contracts";
import { RcTokenContractAddress } from "./web3/Contracts";
import { web3 } from "./web3/Contracts";

export const GetCertificateTokens = async (wallet) => {
    let tokens = 0
    await RcTokenContract.methods.certificate(wallet).call({from: RcTokenContractAddress})
    .then((res) => {
        tokens = res
    })
    .catch((err) => {
        tokens = 0
    })
    return tokens
}

export const GetTokensBalance = async (wallet) => {
    let tokens = 0
    await RcTokenContract.methods.balanceOf(wallet).call({from: RcTokenContractAddress})
    .then((res) => {
        tokens = res
    })
    .catch((err) => {
        tokens = 0
    })
    return tokens
}

export const BurnTokens = async (wallet, tokens) => {
    let type = '';
    let message = '';
    let hashTransaction = '';
    await RcTokenContract.methods.burnTokens(String(tokens)).send({from: wallet})
    .on("confirmation", (receipt) =>
        type = 'success',
        message = "Contributor registered!"
    )
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Contributor registered!"
        }
    })
    .on("error", (error, receipt) => {
        if(error.stack.includes("Not allowed user")){
            return{
                type: 'error',
                message: 'Not allowed user!'
            }
        }
        if (error.stack.includes("User already exists")){
            type = 'error'
            message = 'User already exists'
        }
    });

    return{
        type,
        message,
        hashTransaction,
    }
}

export const BuyRCT = async (wallet, value) => {
    let type = '';
    let message = '';
    let hashTransaction = '';

    await web3.eth.sendTransaction({
        to: '0x1e1cc60a91380c81ecabfbd497c72a7f134f39af',
        from: wallet,
        value: Number(value) * 10**18
    })
    .then((hash) => {
        console.log(hash);
        if(hash){
            hashTransaction = hash.transactionHash
            type = 'success'
            message = "Buy success"
        }

    })
    .catch(err => {
        console.log(err);
    })

    return {
        type, 
        message,
        hashTransaction
    }
}