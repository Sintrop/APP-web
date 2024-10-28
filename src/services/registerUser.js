import { addInspector } from "./web3/inspectorService";
import {api} from './api';
import { createPubliFeed } from "./publiFeed";
import { addResearcher } from "./web3/researchersService";
import { addDeveloper } from "./web3/developersService";
import { addActivist } from "./web3/activistService";
import { addContributor } from "./web3/contributorService";

export async function executeRegisterUser(userData, walletConnected){
    if(userData?.userType === 2){
        const responseInspector = await addInspector(walletConnected, userData?.name, userData?.imgProfileUrl);
        if(responseInspector.success){
            await afterRegisterBlockchain(walletConnected, userData?.id, responseInspector.transactionHash);
            return responseInspector;
        }

        return responseInspector;
    }

    if(userData?.userType === 3){
        const responseResearcher = await addResearcher(walletConnected, userData?.name, userData?.imgProfileUrl);
        if(responseResearcher.success){
            await afterRegisterBlockchain(walletConnected, userData?.id, responseResearcher.transactionHash);
            return responseResearcher;
        }

        return responseResearcher;
    }

    if(userData?.userType === 4){
        const responseDeveloper = await addDeveloper(walletConnected, userData?.name, userData?.imgProfileUrl);
        if(responseDeveloper.success){
            await afterRegisterBlockchain(walletConnected, userData?.id, responseDeveloper.transactionHash);
            return responseDeveloper;
        }

        return responseDeveloper;
    }

    if(userData?.userType === 5){
        const responseContributor = await addContributor(walletConnected, userData?.name, userData?.imgProfileUrl);
        if(responseContributor.success){
            await afterRegisterBlockchain(walletConnected, userData?.id, responseContributor.transactionHash);
            return responseContributor;
        }

        return responseContributor;
    }

    if(userData?.userType === 6){
        const responseActivist = await addActivist(walletConnected, userData?.name, userData?.imgProfileUrl);
        if(responseActivist.success){
            await afterRegisterBlockchain(walletConnected, userData?.id, responseActivist.transactionHash);
            return responseActivist;
        }else{
            return responseActivist;
        }
    }
}

async function afterRegisterBlockchain(walletConnected, userId, transactionHash) {
    await updateAccountStatus(walletConnected);
    await createPubliFeed({
        type: 'new-user',
        userId,
        additionalData: JSON.stringify({ hash: transactionHash }),
    })
}

async function updateAccountStatus(walletConnected) {
    try {
        await api.put('/user/account-status', { userWallet: walletConnected, status: 'blockchain' })
    } catch (e) {
        console.log('error on update account status');
    }
}