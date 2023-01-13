import React, {useEffect, useState} from "react";
import '../certificate.css';
import '../../isa.css';

import {useParams} from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import QRCode from "react-qr-code";
import * as htmlToImage from 'html-to-image';
import {toJpeg} from 'html-to-image';
import { saveAs } from 'file-saver';

import Logo from '../../../../assets/img/262543420-sintrop-logo-com-degrade.png';

//services
import InvestorService from '../../../../services/investorService';
import {GetCertificateTokens} from '../../../../services/sacTokenService';

//components
import Loading from '../../../Loading';
import { ModalContribute } from "./ModalContribute";

export default function InvestorCertificate({userType, wallet, setTab}){
    const investorService = new InvestorService(wallet);
    const {tabActive} = useParams();
    const [investorData, setInvestorData] = useState([]);
    const [tokensBurned, setTokensBurned] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalContribute, setModalContribute] = useState(false);

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {
        if(userType == 7){
            getInvestor();
        }
    }, []);

    async function getInvestor(){
        setLoading(true);
        const response = await investorService.getInvestor(wallet);
        setInvestorData(response);
        const tokens = await GetCertificateTokens(wallet);
        setTokensBurned(tokens);
        setLoading(false);
    }

    function downloadCertificate(){
        setLoading(true);
        const fileNameShort = `Certificate_Short_${wallet}`;
        var certificateShort = document.querySelector(".container__certificate-container-short");
        htmlToImage.toJpeg(certificateShort)
        .then((dataUrlShort) => {
            saveAs(dataUrlShort, fileNameShort);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
        })    
    }

    return(
        <div className="container-isa-page">
            <div className='header-isa'>
                <h1>Investor Certificate</h1>
                <div className='area-btn-header-isa-page'>
                    <button
                        className='btn-new-category-isa'
                        onClick={() => downloadCertificate()}
                    >
                        Download Certificate
                    </button>

                    <CopyToClipboard text={`${window.location.host}/account-producer/${wallet}`}>
                        <button
                            className='btn-new-category-isa'
                            onClick={() => alert('URL copied to clipboard')}
                        >
                            Copy URL
                        </button>
                    </CopyToClipboard>
                </div>
            </div>

            <div className="area-certificates">
                <div className="container__certificate-container-short">
                    <img src={Logo} className='img-logo-certificate'/>
                    <QRCode value={`${window.location.host}/account-producer/${wallet}`} size={190}/>
                    <p className="hash-qrcode">{investorData === [] ? '' : investorData.investorWallet}</p>
                    <p style={{textAlign: 'center'}}>
                        The investor 
                        <span style={{fontWeight: 'bold', color: 'green'}}> {investorData === [] ? '' : investorData.name}</span> contributed to the agroecological transition with a total of:
                    </p>
                    <div style={{backgroundColor: '#1eb76f', paddingLeft: 10, paddingRight: 10, borderRadius: 8}}>
                        <p style={{fontWeight: 'bold'}}>{tokensBurned} SAC Tokens</p>
                    </div>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: 300}}>
                    {tokensBurned === '0' ? (
                        <p style={{textAlign: 'center'}}>
                            You haven't contributed to the agroecological transition yet
                        </p>
                    ) : (
                        <p style={{color: 'green', textAlign: 'center'}}>
                            The earth thanks your contribution. Together we will make agriculture sustainable!
                        </p>
                    )}

                    <Dialog.Root onOpenChange={(open) => setModalContribute(open)} open={modalContribute}>
                        <Dialog.Trigger>{tokensBurned === '0' ? 'Contribute' : 'Contribute more'}</Dialog.Trigger>
                        <ModalContribute 
                            wallet={wallet} 
                            onFinished={() => {
                                getInvestor();
                                setModalContribute(false)
                            }}
                        />
                    </Dialog.Root>

                    <p style={{textAlign: 'center'}}>Read our documentation to understand better</p>
                </div>
            </div>

            {loading && (
                <Loading/>
            )}
        </div>
    )
}