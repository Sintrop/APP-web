export const web3RequestWrite = async (contract, method, params, from) => {
    let hashTransaction = null
    let type = null
    let message = null
    let response = null

    response = await contract.methods[method](...params).send({ from: from })
    .on('transactionHash', (hash) => {
      if(!hash) return;

      hashTransaction = hash
      type = 'success'
      message = "Transaction sent successfully"
    })
    .on("error", (error, receipt) => {
      // throw new Web3ErrorService(error, receipt);
    })

    return {
      response,
      type, 
      message,
      hashTransaction
    }
}
