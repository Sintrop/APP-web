import React, {useEffect, useState} from 'react';
import './itemCategory.css';
import { get } from '../../../config/infura'
//services
import {GetCategories} from '../../../services/isaService';

export default function ItemCategory({data}){
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryResult, setCategoryResult] = useState('');
    const [resultDescription, setResultDescription] = useState('');
    const [proofPhoto, setProofPhoto] = useState('')
    console.log(data)
    useEffect(() => {
        checkResult();
        getCategory();
    },[])

    function checkResult(){
        if(data.isaIndex === '0'){
            setCategoryResult('Totally Sustainable');
        }else if(data.isaIndex === '1'){
            setCategoryResult('Partially Sustainable');
        }else if(data.isaIndex === '2'){
            setCategoryResult('Neutro');
        }else if(data.isaIndex === '3'){
            setCategoryResult('Partially Not Sustainable');
        }else if(data.isaIndex === '4'){
            setCategoryResult('Totally Not Sustainable');
        }
    }

    async function getCategory(){
        const response = await GetCategories();
        getProofPhoto();
        response.forEach((item) => {
            if(item.id === data.categoryId){
                setTitle(item.name);
                setDescription(item.description);
                if(data.isaIndex === '0'){
                    setResultDescription(item.totallySustainable);
                }else if(data.isaIndex === '1'){
                    setResultDescription(item.partiallySustainable);
                }else if(data.isaIndex === '2'){
                    setResultDescription(item.neutro);
                }else if(data.isaIndex === '3'){
                    setResultDescription(item.partiallyNotSustainable);
                }else if(data.isaIndex === '4'){
                    setResultDescription(item.totallyNotSustainable);
                }
            }
        })
    }

    const getProofPhoto = async () => {
        const res =  await get(data.proofPhoto)
        setProofPhoto(res)
     }
    return(
        <div className='item-category__container'>
            <div className='item-category__area-top-card'>
                <div className='area-top-card__container-proof-photo'>
                    <p className='container-proof-photo__title-category'>{title}</p>
                    <div className='proof-photo'>
                        <img src={`data:image/*;base64,${proofPhoto}`} alt='ProofPhoto' />
                    </div>
                    <p className='container-proof-photo__title-proof-photo'>Proof Photo</p>
                </div>
                <div className='area-top-card__category-info'>
                    <h3 className='category-info__titles'>Category description</h3>
                    <p className='category-info__description'>{description}</p>

                    <h3 className='category-info__titles'>Category Result</h3>
                    <p className='category-info__description'>{categoryResult}</p>

                    <h3 className='category-info__titles'>Result Description</h3>
                    <p className='category-info__description'>{resultDescription}</p>
                </div>
            </div>
            <div className='container__area-actvist-report'>
                <h3 className='category-info__titles'>Activist Report</h3>
                <p className='category-info__description'>{data.report}</p>
            </div>
        </div>
    )
}