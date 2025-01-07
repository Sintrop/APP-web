import { ReturnTransactionProps } from "../web3/rcTokenService";
import { addLevel } from "../web3/validatorService";

interface ExecuteDeclareAlive{
    walletConnected: string;
}
export async function executeDeclareAlive({walletConnected}: ExecuteDeclareAlive): Promise<ReturnTransactionProps>{
    const response = await addLevel({walletConnected});
    return response;
}