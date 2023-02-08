import { useEffect, useState, createContext } from "react";

export const MainContext = createContext({})

export default function MainProvider({children}){
    const [teste, setTeste] = useState('ok');

    return(
        <MainContext.Provider
            value={{teste}}
        >
            {children}
        </MainContext.Provider>
    )
}