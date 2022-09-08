import React, {useState} from "react";
import Web3 from "web3";
import './createCategory.css';

import CategoryContract from '../../../data/contracts/abis/CategoryContract.json';

//components
import Loading from '../../Loading';

export default function CreateCategory({closeCreateCategory, walletAddress, reloadCategories}){
    const contractAddress = CategoryContract.networks[5777].address;
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tutorial, setTutorial] = useState('');
    const [totallySustainable, setTotallySustainable] = useState('');
    const [partiallySustainable, setPartiallySustainable] = useState('');
    const [neutro, setNeutro] = useState('');
    const [partiallyNotSustainable, setPartiallyNotSustainable] = useState('');
    const [totallyNotSustainable, setTotallyNotSustainable] = useState('');

    function close(){
        setName('');
        setDescription('');
        setTutorial('');
        setTotallySustainable('');
        setPartiallySustainable('');
        setNeutro('');
        setPartiallyNotSustainable('');
        setTotallyNotSustainable('');
        closeCreateCategory();
    }
    
    function addCategory(){
        setLoading(true);
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(CategoryContract.abi, contractAddress);
        contract.methods.addCategory(
            name, 
            description,
            tutorial, 
            totallySustainable, 
            partiallySustainable,
            neutro,
            partiallyNotSustainable,
            totallyNotSustainable
        ).send({from: walletAddress})
        .on('transactionHash', (hash) => {
            setLoading(false);
            reloadCategories();
            close();
        })
    }

    return(
        <div className="container-create-category">
            <div className="card-create-category">
                <div className="header-create-category">
                    <p className='tit-categories-isa'>Create Category</p>
                    <button
                        className="btn-close-create-category"
                        onClick={() => close()}
                    >
                        X
                    </button>
                </div>
                <form>
                    <label for='name-category-isa'>Category Name</label>
                    <input
                        type='text'
                        id='name-category-isa'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='input-form-isa'
                        placeholder='Name of category'
                    />

                    <label for='description-category-isa'>Category Description</label>
                    <input
                        type='text'
                        id='description-category-isa'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='input-form-isa'
                        placeholder='Description of category'
                    />

                    <label for='description-category-isa'>Tutorial</label>
                    <input
                        type='text'
                        id='description-category-isa'
                        value={tutorial}
                        onChange={(e) => setTutorial(e.target.value)}
                        className='input-form-isa'
                        placeholder='Category assessment tutorial'
                    />

                    <label for='totally-sustainable-category-isa'>Totally Sustainable</label>
                    <input
                        type='text'
                        id='totally-sustainable-category-isa'
                        value={totallySustainable}
                        onChange={(e) => setTotallySustainable(e.target.value)}
                        className='input-form-isa'
                        placeholder='Description text to this metric'
                    />

                    <label for='partially-sustainable-category-isa'>Partially Sustainable</label>
                    <input
                        type='text'
                        id='partially-sustainable-category-isa'
                        value={partiallySustainable}
                        onChange={(e) => setPartiallySustainable(e.target.value)}
                        className='input-form-isa'
                        placeholder='Description text to this metric'
                    />

                    <label for='neutro-category-isa'>Neutro</label>
                    <input
                        type='text'
                        id='neutro-category-isa'
                        value={neutro}
                        onChange={(e) => setNeutro(e.target.value)}
                        className='input-form-isa'
                        placeholder='Description text to this metric'
                    />

                    <label for='partially-not-sustainable-category-isa'>Partially Not Sustainable</label>
                    <input
                        type='text'
                        id='partially-not-sustainable-category-isa'
                        value={partiallyNotSustainable}
                        onChange={(e) => setPartiallyNotSustainable(e.target.value)}
                        className='input-form-isa'
                        placeholder='Description text to this metric'
                    />

                    <label for='totally-not-sustainable-category-isa'>Totally Not Sustainable</label>
                    <input
                        type='text'
                        id='totally-not-sustainable-category-isa'
                        value={totallyNotSustainable}
                        onChange={(e) => setTotallyNotSustainable(e.target.value)}
                        className='input-form-isa'
                        placeholder='Description text to this metric'
                    />
                </form>

                <div className="footer-create-category">
                    <button
                        className="btn-cancel-create-category"
                        onClick={() => close()}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn-create-create-category"
                        onClick={() => addCategory()}
                    >
                        Create
                    </button>
                </div>
            </div>
            {loading && (
                <Loading/>
            )}
        </div>
    )
}