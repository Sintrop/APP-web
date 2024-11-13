import { createPubliFeed } from "../publicationFeed";
import { getUserApi } from "../userApi";
import { withdrawTokens as withdrawDeveloper } from "../web3/developersService";
import { withdrawTokens as withdrawProducer } from "../web3/producerService";
import { withdrawTokens as withdrawInspector } from "../web3/inspectorService";
import { withdrawTokens as withdrawResearcher } from "../web3/researchersService";
import { withdrawTokens as withdrawContributor} from "../web3/contributorService";
import { withdrawTokens as withdrawActivist } from "../web3/activistService";
import { withdrawTokens as withdrawValidator } from "../web3/validatorService";

interface ReturnTransactionProps {
    transactionHash: string;
    success: boolean;
    message: string;
    code: number;
}

interface ExecuteWithdrawTokensProps {
    walletConnected: string;
}

export async function executeWithdrawTokens({ walletConnected }: ExecuteWithdrawTokensProps): Promise<ReturnTransactionProps> {
    const response = await getUserApi(walletConnected);
    if(!response.success){
        return{
            code: 500,
            message: 'error on get user api',
            success: false,
            transactionHash: ''
        }
    }

    const user = response.user;

    if(user.userType === 1){
        const responseWithdrawProducer = await withdrawProducer({walletConnected});
        if(responseWithdrawProducer.success){
            await afterWithdraw({
                transactionHash: responseWithdrawProducer.transactionHash,
                userId: user.id,
            })
            return responseWithdrawProducer;
        }

        return responseWithdrawProducer;
    }

    if(user.userType === 2){
        const responseWithdrawInspector = await withdrawInspector({walletConnected});
        if(responseWithdrawInspector.success){
            await afterWithdraw({
                transactionHash: responseWithdrawInspector.transactionHash,
                userId: user.id,
            })
            return responseWithdrawInspector;
        }

        return responseWithdrawInspector;
    }

    if(user.userType === 3){
        const responseWithdrawResearcher = await withdrawResearcher({walletConnected});
        if(responseWithdrawResearcher.success){
            await afterWithdraw({
                transactionHash: responseWithdrawResearcher.transactionHash,
                userId: user.id,
            })
            return responseWithdrawResearcher;
        }

        return responseWithdrawResearcher;
    }

    if(user.userType === 4){
        const responseWithdrawDeveloper = await withdrawDeveloper({walletConnected});
        if(responseWithdrawDeveloper.success){
            await afterWithdraw({
                transactionHash: responseWithdrawDeveloper.transactionHash,
                userId: user.id,
            })
            return responseWithdrawDeveloper;
        }

        return responseWithdrawDeveloper;
    }

    if(user.userType === 5){
        const responseWithdrawContributor = await withdrawContributor({walletConnected});
        if(responseWithdrawContributor.success){
            await afterWithdraw({
                transactionHash: responseWithdrawContributor.transactionHash,
                userId: user.id,
            })
            return responseWithdrawContributor;
        }

        return responseWithdrawContributor;
    }

    if(user.userType === 6){
        const responseWithdrawActivist = await withdrawActivist({walletConnected});
        if(responseWithdrawActivist.success){
            await afterWithdraw({
                transactionHash: responseWithdrawActivist.transactionHash,
                userId: user.id,
            })
            return responseWithdrawActivist;
        }

        return responseWithdrawActivist;
    }

    if(user.userType === 8){
        const responseWithdrawValidator = await withdrawValidator({walletConnected});
        if(responseWithdrawValidator.success){
            await afterWithdraw({
                transactionHash: responseWithdrawValidator.transactionHash,
                userId: user.id,
            })
            return responseWithdrawValidator;
        }

        return responseWithdrawValidator;
    }

    return{
        code: 500,
        message: 'error on execute withdraw',
        success: false,
        transactionHash: ''
    }
}

interface AfterWithdrawProps{
    userId: string;
    transactionHash: string;
}
async function afterWithdraw(props: AfterWithdrawProps){
    const {userId, transactionHash} = props;

    await createPubliFeed({
        type: 'withdraw-tokens',
        userId,
        additionalData: JSON.stringify({hash: transactionHash, transactionHash})
    })
}