import { InspectorContract } from "./Contracts";
import { web3RequestWrite } from "./requestService";

interface AddInspectorProps{
    walletConnected: string;
    name: string;
    proofPhoto: string;
}
export async function addInspector({walletConnected, name, proofPhoto}: AddInspectorProps){
    const response = await web3RequestWrite(InspectorContract, 'addInspector', [name, proofPhoto], walletConnected);
    return response;
}

export const GetInspector = async (wallet: string) => {
    const inspector = await InspectorContract.methods.getInspector(wallet).call();
    return inspector
}

export const GetInspectors = async () => {
    const inspectors = await InspectorContract.methods.getInspectors().call()
    console.log(inspectors);
    return inspectors;
}

interface WithdrawTokensProps{
    walletConnected: string;
}
export async function withdrawTokens({walletConnected}: WithdrawTokensProps){
    const response = await web3RequestWrite(InspectorContract, 'withdraw', [], walletConnected);
    return response;
}