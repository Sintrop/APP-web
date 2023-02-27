import React, {useEffect, useState} from 'react';
import './itemCategoryResult.css';
import { useTranslation } from 'react-i18next';

//services
import {GetCategories} from '../../../services/isaService';
import { get } from '../../../config/infura'
export default function ItemCategoryResult({data, isas}){
    const {t} = useTranslation();
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [result, setResult] = useState('');
    const [proofPhoto, setProofPhoto] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCategories();
        getProofPhoto()
        if(data.isaIndex === '0'){
            setResult('Totally Sustainable');
        }else if(data.isaIndex === '1'){
            setResult('Partially Sustainable');
        }else if(data.isaIndex === '2'){
            setResult('Neutro');
        }else if(data.isaIndex === '3'){
            setResult('Partially Not Sustainable');
        }else if(data.isaIndex === '4'){
            setResult('Totally Not Sustainable');
        }

    }, []);

    const getProofPhoto = async () => {
       setLoading(true);
       const res =  await get(data.proofPhoto)
       setProofPhoto(res);
       setLoading(false);
    }

    async function getCategories(){
        const response = await GetCategories();
        setCategories(response);
        setStates(response);
    }

    function setStates(res){
        for(var i = 0; i < res.length; i++){
            if(res[i].id == data.categoryId){
                setCategory(res[i].name);
                setDescription(res[i].description)
            }
        }
    }


    return(
        <div className='item-category__container'>
            <div>
                <h3 className='title_category_result'>{category}</h3>
                <p className='labels'>{t('Category Description')}</p>
                <p className='title_descriptions'>{description}</p>

                <p className='labels'>{t('Result of Inspection')}</p>
                <p className='title_descriptions'>{result}</p>

                <p className='labels'>{t('Report')}</p>
                <p className='title_descriptions'>{data.report}</p>
            </div>
            <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
                {loading ? (
                    <div style={{display: 'flex', width: '400px', height: '250px', alignItems: 'center', justifyContent: 'center'}}>
                        <p style={{fontWeight: 'bold'}}>Loading proofPhoto</p>
                    </div>
                ) : (
                    <img className='item-category__proofPhoto' alt='proofPhoto' src={`data:image/*;base64,${proofPhoto}`}/> 
                )}
            </div>
        </div>
    )
}