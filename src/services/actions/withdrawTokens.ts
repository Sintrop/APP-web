import { createPubliFeed } from "../publicationFeed";
import { getUserApi } from "../userApi";
import { withdrawTokens as withdrawDeveloper } from "../web3/developersService";
import { withdrawTokens as withdrawProducer } from "../web3/producerService";
import { withdrawTokens as withdrawInspector } from "../web3/inspectorService";
import { withdrawTokens as withdrawResearcher } from "../web3/researchersService";

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