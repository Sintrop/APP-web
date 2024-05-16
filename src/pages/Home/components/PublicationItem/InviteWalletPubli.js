import React from "react";

export function InviteWalletPubli({data}){
    const additionalData = JSON.parse(data?.additionalData);

    return(
        <div>
            <p className='text-white'>
                Convidou a wallet <span className='font-bold text-green-600'>{additionalData?.walletInvited} </span>
                para se cadastrar como
                <span className='font-bold text-green-600'>
                    {additionalData?.userType === 1 && ' Produtor(a) '}
                    {additionalData?.userType === 2 && ' Inspetor(a) '}
                    {additionalData?.userType === 3 && ' Pesquisador(a) '}
                    {additionalData?.userType === 4 && ' Desenvolvedor(a) '}
                    {additionalData?.userType === 5 && ' Produtor(a) '}
                    {additionalData?.userType === 6 && ' Ativista '}
                    {additionalData?.userType === 7 && ' Apoiador(a) '}
                    {additionalData?.userType === 8 && ' Validador(a) '}
                </span>
                no Sistema Descentralizado de Regeneração da Natureza e receberá 1% de comissão sobre as contribuições realizadas
            </p>
        </div>
    )
}