async function ConnectWallet(){
    if(window.ethereum){
        try{
            const address = await window.ethereum.request({
                method: 'eth_requestAccounts'
            })

            console.log(address)
    
            const object = {
                connectedStatus: true,
                status: 'Conectado com sucesso',
                address
            }
    
            return object;
        }catch(err){
            return {
                connectedStatus: false,
                status: 'erro ao conectar a carteira!',
            }
        }
    }else{
        return{
            connectedStatus: false,
            status: 'MetaMask não instalado no navegador!',
        }
    }
}

export default ConnectWallet;