import { addInspector } from "./web3/inspectorService";
import {api} from './api';
import { createPubliFeed } from "./publicationFeed";
import { addResearcher } from "./web3/researchersService";
import { addDeveloper } from "./web3/developersService";
import { addActivist } from "./web3/activistService";
import { addContributor } from "./web3/contributorService";
import { UserApiProps } from "../types/user";
import { addValidator } from "./web3/validatorService";
import { ReturnTransactionProps } from "./web3/rcTokenService";

export async function executeRegisterUser(userData: UserApiProps, walletConnected: string): Promise<ReturnTransactionProps>{
    if(userData?.userType === 2){
        const responseInspector = await addInspector({walletConnected, name: userData?.name, proofPhoto: userData?.imgProfileUrl});
        if(responseInspector.success){
            await afterRegisterBlockchain(walletConnected, userData?.id, responseInspector.transactionHash);
            return responseInspector;
        }

        return responseInspector;
    }

    if(userData?.userType === 3){
        const responseResearcher = await addResearcher({walletConnected, name: userData?.name, proofPhoto: userData?.imgProfileUrl});
        if(responseResearcher.success){
            await afterRegisterBlockchain(walletConnected, userData?.id, responseResearcher.transactionHash);
            return responseResearcher;
        }

        return responseResearcher;
    }

    if(userData?.userType === 4){
        const responseDeveloper = await addDeveloper({walletConnected, name: userData?.name, proofPhoto: userData?.imgProfileUrl});
        if(responseDeveloper.success){
            await afterRegisterBlockchain(walletConnected, userData?.id, responseDeveloper.transactionHash);
            return responseDeveloper;
        }

        return responseDeveloper;
    }

    if(userData?.userType === 5){
        const responseContributor = await addContributor({walletConnected, name: userData?.name, proofPhoto: userData?.imgProfileUrl});
        if(responseContributor.success){
            await afterRegisterBlockchain(walletConnected, userData?.id, responseContributor.transactionHash);
            return responseContributor;
        }

        return responseContributor;
    }

    if(userData?.userType === 6){
        const responseActivist = await addActivist({walletConnected, name: userData?.name, proofPhoto: userData?.imgProfileUrl});
        if(responseActivist.success){
            await afterRegisterBlockchain(walletConnected, userData?.id, responseActivist.transactionHash);
            return responseActivist;
        }else{
            return responseActivist;
        }
    }

    if(userData?.userType === 8){
        const responseValidator = await addValidator({walletConnected});
        if(responseValidator.success){
            await afterRegisterBlockchain(walletConnected, userData?.id, responseValidator.transactionHash);
            return responseValidator;
        }else{
            return responseValidator;
        }
    }

    return {
        code: 0,
        message: 'Error on register user',
        success: false,
        transactionHash: ''
    }
}

async function afterRegisterBlockchain(walletConnected: string, userId: string, transactionHash: string) {
    await updateAccountStatus(walletConnected);
    // await createPubliFeed({
    //     type: 'new-user',
    //     userId,
    //     additionalData: JSON.stringify({ hash: transactionHash }),
    // })
}

async function updateAccountStatus(walletConnected: string) {
    try {
        await api.put('/user/account-status', { userWallet: walletConnected, status: 'blockchain' })
    } catch (e) {
        console.log('error on update account status');
    }
}