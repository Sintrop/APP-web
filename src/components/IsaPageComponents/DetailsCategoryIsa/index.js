import React, {} from 'react';
import '../CreateCategory/createCategory.css';
import './detailsCategoryIsa.css';

export default function DetailsCategoryIsa({data, close}){
    return(
        <div className="container-create-category">
            <div className="card-create-category">
                <div className="header-create-category">
                    <p className='tit-categories-isa'>Details Category</p>
                    <button
                        className="btn-close-create-category"
                        onClick={() => close()}
                    >
                        X
                    </button>
                </div>

                <div className='container-content-detail-category'>
                    <p className='title-details-category-isa'>Created By</p>
                    <p className='description-details-category-isa'>{data.createdBy}</p>

                    <p className='title-details-category-isa'>Category Name</p>
                    <p className='description-details-category-isa'>{data.name}</p>

                    <p className='title-details-category-isa'>Category Description</p>
                    <p className='description-details-category-isa'>{data.description}</p>

                    <p className='title-details-category-isa'>Category Tutorialy</p>
                    <p className='description-details-category-isa'>{data.tutorial}</p>

                    <p className='title-details-category-isa'>Totally Sustainable</p>
                    <p className='description-details-category-isa'>{data.totallySustainable}</p>

                    <p className='title-details-category-isa'>Partially Sustainable</p>
                    <p className='description-details-category-isa'>{data.partiallySustainable}</p>

                    <p className='title-details-category-isa'>Neutro</p>
                    <p className='description-details-category-isa'>{data.neutro}</p>

                    <p className='title-details-category-isa'>Partially Not Sustainable</p>
                    <p className='description-details-category-isa'>{data.partiallyNotSustainable}</p>

                    <p className='title-details-category-isa'>Totally Not Sustainable</p>
                    <p className='description-details-category-isa'>{data.totallyNotSustainable}</p>
                </div>
            </div>
        </div>
    )
}