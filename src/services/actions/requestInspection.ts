import { requestInspection } from "../web3/sintropService";
import { ReturnTransactionProps } from "../web3/rcTokenService";
import { api } from "../api";
import { createPubliFeed } from "../publicationFeed";

interface ExecuteRequestInspectionProps {
    walletConnected: string;
}

export async function executeRequestInspection({ walletConnected }: ExecuteRequestInspectionProps): Promise<ReturnTransactionProps> {
    const responseWeb3 = await requestInspection({ walletConnected });

    if (responseWeb3.success) {
        await afterRequestInspection({
            walletConnected,
            transactionHash: responseWeb3.transactionHash,
        });

        return responseWeb3;
    } else {
        return responseWeb3;
    }
}

interface AfterRequestInspection {
    walletConnected: string;
    transactionHash: string;
}
async function afterRequestInspection({ walletConnected, transactionHash }: AfterRequestInspection) {
    await createPubliFeed({
        additionalData: JSON.stringify({hash: transactionHash}),
        type: 'request-inspection',
        walletConnected
    });

    try {
        const dataNotification = {
            text1: 'Request new inspection',
            text2: ''
        }

        await api.post('/notifications/send', {
            from: walletConnected,
            group: 'inspectors',
            type: 'request-inspection',
            data: JSON.stringify(dataNotification),
            for: 'inspectors'
        });
    }catch(e){
        console.log(e);
        console.log('error to send notification to inspectors');
    }
}