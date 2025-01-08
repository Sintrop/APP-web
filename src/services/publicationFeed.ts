interface CreatePubliProps{
    type: string;
    additionalData: string;
    userId?: string;
    walletConnected?: string;
}

export async function createPubliFeed(data: CreatePubliProps){
    return true;
    
}