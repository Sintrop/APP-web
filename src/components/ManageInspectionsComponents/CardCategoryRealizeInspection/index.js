import React, {useState} from 'react';
import '../ModalRealize/modalRealize.css';

export default function CardCategoryRealizeInspection({data, pushResult}){
    const [result, setResult] = useState('');
    const [report, setReport] = useState('');
    const [proofPhoto, setProofPhoto] = useState('hash');
    
    return(
        <div className="card_category_realize_inspection" key={data.id}>
            <h3>{data.name}</h3>
            <div className="area_description_result">
                <div className="area-description">
                    <h4>Description:</h4>
                    <p>{data.description}</p>
                </div>
                <div className="area-result">
                    <p>Result:</p>
                    <select
                        value={result}
                        onChange={(e) => {
                            pushResult(data.id, e.target.value, report, proofPhoto);
                            setResult(e.target.value);
                        }}
                    >
                        <option value=''>Select an option</option>
                        <option value='0'>Totally Sustainable</option>
                        <option value='1'>Partially Sustainable</option>
                        <option value='2'>Neutro</option>
                        <option value='3'>Partially Not Sustainable</option>
                        <option value='4'>Totally Not Sustainable</option>
                    </select>
                </div>
            </div>
            <div className='area_report_realize_inspection'>
                <p>Report:</p>
                <textarea
                    value={report}
                    onChange={(e) => {
                        setReport(e.target.value);
                        pushResult(data.id, result, e.target.value, proofPhoto);
                    }}
                    placeholder='Type here'
                />
            </div>

            <div className='area_upload_photo_realize_inspection'>
                <p>Upload proof photo:</p>
                <input type='file' 
                onChange={(e) => {

                    const file = e.target.files[0]
                    const reader = new window.FileReader()
                    reader.readAsArrayBuffer(file)
                    reader.onload = () => { 
                        const buf = Buffer.from(reader.result)
                        console.log(buf)
                    }
                    setProofPhoto(e.target.value);
                    pushResult(data.id, result, report, e.target.value);
                }}
                />
            </div>
        </div>
    )
}