import React from 'react';

export function NewUserPubli({userData}){
    return(
        <div>
            <p className='text-white'>
                O(a) usuário(a) <span className='font-bold text-green-600'>{userData?.name} </span>
                se cadastrou como 
                <span className='font-bold text-green-600'>
                    {userData?.userType === 1 && ' Produtor(a) '}
                    {userData?.userType === 2 && ' Inspetor(a) '}
                    {userData?.userType === 3 && ' Pesquisador(a) '}
                    {userData?.userType === 4 && ' Desenvolvedor(a) '}
                    {userData?.userType === 5 && ' Produtor(a) '}
                    {userData?.userType === 6 && ' Ativista '}
                    {userData?.userType === 7 && ' Apoiador(a) '}
                    {userData?.userType === 8 && ' Validador(a) '}
                </span>
                na versão 6 do Sistema Descentralizado de Regeneração da Natureza
            </p>
        </div>
    )
}