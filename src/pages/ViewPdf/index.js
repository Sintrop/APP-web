import React, {useEffect, useState} from 'react';
import {pdfjs, Document, Page} from 'react-pdf';
import {get} from '../../config/infura';
import {useParams} from 'react-router-dom';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export function ViewPdf(){
    const {hash}= useParams();
    const [pdf, setPdf] = useState(null);
    const [pages, setPages] = useState([]);

    useEffect(() => {
        getPdf();
    },[]);

    async function getPdf(){
        const response = await get(hash);
        //console.log(response)
        setPdf('data:application/pdf;base64,'+response);
    }

    function onLoadPdf(data){
        const numPages = data?._pdfInfo?.numPages;

        let pages = [];
        for(var i = 0; i < Number(numPages); i++){
            pages.push({numPage: i + 1})
        }

        setPages(pages);
    }

    return(
        <Document
            file={pdf}
            onLoadSuccess={(res) => onLoadPdf(res)}
        >
            {pages.map((item, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} renderTextLayer={false} className='mb-[-880px] border rounded-sm border-gray-400'/>    
            ))}
        </Document>
    )
}