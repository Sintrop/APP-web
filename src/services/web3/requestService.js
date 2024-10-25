export async function web3RequestWrite(
    contract,
    method,
    params,
    from
) {
    let transactionHash = ''
    let success = false
    let message = ''
    let code = 0;

    try {
        await contract.methods[method](...params).send({ from: from })
            .on('transactionHash', (hash) => {
                transactionHash = hash
                success = true
                message = "Transaction sent successfully"
            })
            .on("error", (error) => {
                // throw new Web3ErrorService(error, receipt);
                console.log(error?.message);
                message = error?.message;
            })
    } catch (e) {
        code = e?.code;
        message = e?.message
    }

    return {
        success,
        message,
        transactionHash,
        code
    }
}