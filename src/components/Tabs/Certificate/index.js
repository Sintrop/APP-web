import React, {useEffect, useState} from "react";
import './certificate.css';
import '../isa.css';
import {useParams} from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import QRCode from "react-qr-code";
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import Logo from '../../../assets/img/262543420-sintrop-logo-com-degrade.png';
import { useTranslation } from "react-i18next";

//services
import {GetProducer} from '../../../services/producerService';
import {GetDelation} from '../../../services/userService';

//components
import Loading from '../../Loading';

export default function ProducerCertificate({userType, wallet, setTab}){
    const {t} = useTranslation();
    const {tabActive} = useParams();
    const [producerData, setProducerData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [delationsReceived, setDelationsReceived] = useState('0');

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {
        if(userType == 1){
            getProducer();
        }
    }, []);

    async function getProducer(){
        setLoading(true);
        const response = await GetProducer(wallet);
        setProducerData(response);
        const delations = await GetDelation(response.producerWallet);
        setDelationsReceived(delations.length);
        setLoading(false);
    }

    function downloadCertificate(){
        setLoading(true);
        const fileNameLong = `Certificate_Long_${wallet}`;
        const fileNameShort = `Certificate_Short_${wallet}`;
        var certificateLong = document.querySelector(".container__certificate-container");
        var certificateShort = document.querySelector(".container__certificate-container-short");
        htmlToImage.toJpeg(certificateLong)
        .then((dataUrl) => {
            saveAs(dataUrl, fileNameLong)
            htmlToImage.toJpeg(certificateShort)
            .then((dataUrlShort) => {
                saveAs(dataUrlShort, fileNameShort);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            })
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        })
    }

    if(userType != 1){
        return(
            <div>
                <h1>This account is not a producer.</h1>
            </div>
        )
    }

    return(
        <div className="container-isa-page">
            <div className='header-isa'>
                <h1>{t('Certificate')}</h1>
                <div className='area-btn-header-isa-page'>
                    <button
                        className='btn-new-category-isa'
                        onClick={() => downloadCertificate()}
                    >
                        {t('Download')} {t('Certificate')}
                    </button>

                    <CopyToClipboard text={`${window.location.host}/account-producer/${wallet}`}>
                        <button
                            className='btn-new-category-isa'
                            onClick={() => alert('URL copied to clipboard')}
                        >
                            {t('Copy')} URL
                        </button>
                    </CopyToClipboard>
                </div>
            </div>

            <div className="area-certificates">
                <div className="certificate__container">
                    <div className="container__area-info-producer">
                        <div className="area-info-producer__card-info">
                            <h1 className="card-info__title">{t('Name')}</h1>
                            <p className="card-info__description">{producerData === [] ? '' : producerData.name}</p>
                        </div>
                        <div className="area-info-producer__card-info">
                            <h1 className="card-info__title">{t('Address')}</h1>
                            <p className="card-info__description">{producerData.propertyAddress === undefined ? '' : `${producerData.propertyAddress.city}/${producerData.propertyAddress.state}, ${producerData.propertyAddress.country}`}</p>
                            <p className="card-info__description">{t('Zip Code')}: {producerData.propertyAddress === undefined ? '' : `${producerData.propertyAddress.cep}`}</p>
                        </div>
                    </div>

                    <p className="card-info__title">{t('Certificate')}</p>
                    <div className="container__certificate-container">
                        <div className="qrcode-area">
                            <div className="qrcode">
                                <QRCode value={`${window.location.host}/account-producer/${wallet}`} size={180}/>
                            </div>
                            <p className="hash-qrcode">{producerData === [] ? '' : producerData.producerWallet}</p>                            </div>

                        <div className="certificate-container__producer-score-info">
                            <img src={Logo} className='img-logo-certificate'/>

                            <p className="producer-score-info__description">
                                {t('Sustainability Score')}: {producerData.isa === undefined ? '' : producerData.isa.isaScore}
                            </p>
                            <p className="producer-score-info__description">
                                {t('Total Inspections')}: {producerData === [] ? '' : producerData.totalInspections}
                            </p>
                            <p className="producer-score-info__description color-red">{t('Received Complaints')}: {delationsReceived}</p>
                        </div>
                    </div>
                </div>

                <div className="container__certificate-container-short">
                    <img src={Logo} className='img-logo-certificate'/>
                    <QRCode value={`${window.location.host}/account-producer/${wallet}`} size={190}/>
                    <p className="hash-qrcode">{producerData === [] ? '' : producerData.producerWallet}</p>
                </div>
            </div>

            {loading && (
                <Loading/>
            )}
        </div>
    )
}