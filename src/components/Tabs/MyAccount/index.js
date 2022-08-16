import React, {useEffect, useState} from 'react';

import ProducerPage from '../ProducerPage';
import ActvistPage from '../ActivistPage';

export default function MyAccount({wallet, userType}){
    return(
        <div>
            {userType == 1 && (
                <ProducerPage wallet={wallet}/>
            )}

            {userType == 2 && (
                <ActvistPage wallet={wallet}/>
            )}
        </div>
    )
}