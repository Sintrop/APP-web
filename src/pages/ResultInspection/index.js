import React from "react";
import { Header } from "../../components/Header";
import { useParams } from "react-router";
import { TopBar } from '../../components/TopBar';
import { Inspection } from "./components/Inspection";
import { Feedback } from "../../components/Feedback";
import { Helmet } from "react-helmet";
import { Chat } from '../../components/Chat';

export function ResultInspection() {
    const { id } = useParams();

    return (
        <div className={`bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col h-[100vh]`}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Resultado da inspeção #{id} - Sintrop</title>
                <link rel="canonical" href={`https://app.sintrop.com/result-inspection/${id}`} />
                <link rel="icon" href="/favicon.png" />
                <meta
                    name="description"
                    content="Veja o resultado e todos os dados coletados na inspeção"
                />
            </Helmet>

            <TopBar />
            <Header />

            <div className="flex flex-col items-center w-full lg:pt-32 pt-10 overflow-auto pb-20 lg:pb-5">
                <div className="flex flex-col w-full lg:w-[1024px] mt-3 p-2 lg:p-0">
                    <Inspection id={id} />
                </div>
            </div>

            <div className="hidden lg:flex">
                <Feedback />
                <Chat/>
            </div>
        </div>
    )
}