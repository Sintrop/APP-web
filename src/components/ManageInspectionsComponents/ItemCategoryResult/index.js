import React, {useEffect, useState} from 'react';
import './itemCategoryResult.css';

//services
import {GetCategories} from '../../../services/isaService';

export default function ItemCategoryResult({data, isas}){
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [result, setResult] = useState('');

    useEffect(() => {
        getCategories();
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
        <div>
            <h3 className='title_category_result'>{category}</h3>
            <p className='labels'>Category Description</p>
            <p className='title_descriptions'>{description}</p>

            <p className='labels'>Result of Inspection</p>
            <p className='title_descriptions'>{result}</p>

            <p className='labels'>Report</p>
            <p className='title_descriptions'>{data.report}</p>
        </div>
    )
}