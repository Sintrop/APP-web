import { api } from "./api";

export async function createPubliFeed(data){
    const {additionalData, type, userId, walletConnected} = data;

    let userIdApi = '';

    if(userId){
        userIdApi = userId
    }else{
        if(walletConnected){
            const id = await getUserIdApi(walletConnected);
            userIdApi = id;
        }else{
            return;
        }
    }

    try{
        await api.post('/publication/new', {
            userId: userIdApi,
            type,
            origin: 'platform',
            additionalData,
        })
    }catch(e){
        console.log('erro to create publi in feed');
    }
}

async function getUserIdApi(wallet){
    try{
        const response = await api.get(`/user/${wallet}`);
        return response.data.user.id;
    }catch(e){
        return '';
    }
}