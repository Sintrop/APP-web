import { useContext } from "react";
import { MainContext } from "../contexts/main";

export function useMainContext() {
    const context = useContext(MainContext);
    return context;
}