import { createPubliFeed } from "../publicationFeed";
import { ReturnTransactionProps } from "../web3/rcTokenService";
import { addWork } from "../web3/researchersService";

interface PublishResearcheProps{
    additionalDataTransaction: string;
    walletConnected: string;
}

interface AdditionalDataPublishResearcheProps{
    title: string;
    thesis: string;
    hashPdf: string;
}
export async function executePublishResearche({additionalDataTransaction, walletConnected}: PublishResearcheProps): Promise<ReturnTransactionProps>{
    let additionalData = {} as AdditionalDataPublishResearcheProps;

    if(additionalDataTransaction){
        additionalData = JSON.parse(additionalDataTransaction);
    }

    const {hashPdf, thesis, title} = additionalData;
    const responseWeb3 = await addWork({
        hashPdf, 
        thesis,
        title,
        walletConnected
    });

    if(responseWeb3.success){
        await afterPublish({
            hashPdf,
            thesis,
            title,
            walletConnected,
            transactionHash: responseWeb3.transactionHash,
        });

        return responseWeb3;
    }else{
        return responseWeb3;
    }
}

interface AfterPublishProps extends AdditionalDataPublishResearcheProps{
    transactionHash: string;
    walletConnected: string;
}
async function afterPublish(props: AfterPublishProps){
    const {hashPdf, thesis, title, transactionHash, walletConnected} = props;

    await createPubliFeed({
        type: 'publish-researche',
        walletConnected,
        additionalData: JSON.stringify({
            title,
            thesis,
            file: hashPdf,
            hash: transactionHash
        })
    })
}