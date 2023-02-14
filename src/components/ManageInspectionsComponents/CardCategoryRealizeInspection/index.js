import React, { useEffect, useState } from "react";
import "../ModalRealize/modalRealize.css";
import {save, get} from '../../../config/infura';

export default function CardCategoryRealizeInspection({ data, pushResult, isas, step }) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");
    const [report, setReport] = useState("");
    const [proofPhoto, setProofPhoto] = useState('');
    const [proofPhotoBase64, setProofPhotoBase64] = useState('');
    const [existsPhoto, setExistsPhoto] = useState(false);

    useEffect(() => {
        function setData(){
            const thisCategory = isas.filter(item => item.categoryId === data.id);
            setResult(thisCategory[0]?.isaIndex);
            setReport(thisCategory[0]?.report);
            if(thisCategory[0]?.proofPhoto){
                getBase64(thisCategory[0]?.proofPhoto)
            }
        }
        setData()
    },[step])

    async function saveProofPhoto(file){
        setLoading(true);
        const path = await save(file);
        setProofPhoto(path);
        pushResult(data?.id, result, report, path);
        setLoading(false);
        getBase64(path);
    }
    
    async function getBase64(path){
        setLoading(true);
        const base64 = await get(path);
        setExistsPhoto(true);
        setProofPhotoBase64(base64);
        setLoading(false);
    }
    return (
        <div className="card_category_realize_inspection" key={data?.id}>
            <h3>{data?.name}</h3>
            <div className="area-description">
                <h4>Description:</h4>
                <p>{data?.description}</p>
            </div>
        
            <div className="area-description">
                <h4>Tutorial:</h4>
                <p>{data?.tutorial}</p>
            </div>

            <div className="area-result">
                <p style={{marginTop: 10}}>Result:</p>
                <select
                    value={result}
                    onChange={(e) => {
                        pushResult(data?.id, e.target.value, report, proofPhoto);
                        setResult(e.target.value);
                    }}
                >
                    <option value="">Select an option</option>
                    <option value="0">Totally Sustainable</option>
                    <option value="1">Partially Sustainable</option>
                    <option value="2">Neutro</option>
                    <option value="3">Partially Not Sustainable</option>
                    <option value="4">Totally Not Sustainable</option>
                </select>
            </div>
            <div className="area_report_realize_inspection">
                <p>Report:</p>
                <textarea
                value={report}
                onChange={(e) => {
                    setReport(e.target.value);
                    pushResult(data?.id, result, e.target.value, proofPhoto);
                }}
                placeholder="Type here"
                />
            </div>

            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <p style={{fontWeight: 'bold'}}>Upload proof photo:</p>
                {loading ? (
                    <>
                        <h3>Loading proofPhoto</h3>
                    </>
                ) : (
                    <>
                        {!existsPhoto ? (
                            <input
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    const reader = new window.FileReader();
                                    reader.readAsArrayBuffer(file);
                                    reader.onload = () => {
                                        const arrayBuffer = reader.result
                                        const file = new Uint8Array(arrayBuffer);
                                        saveProofPhoto(file);
                                    };
                                }}
                            />
                        ) : (
                            <>
                                <img
                                    src={`data:image/png;base64,${proofPhotoBase64}`}
                                    style={{width: 400, height: 220, objectFit: "cover", marginBottom: 10}}
                                />
                                <button onClick={() => {
                                    setExistsPhoto(false);
                                    setProofPhotoBase64('');
                                }}>Select another photo</button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
