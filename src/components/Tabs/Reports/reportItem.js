import React from 'react';
import './reportItem.css';
import FarmImg from '../../../assets/img/farm.jpg'

export default function ReportItem(){
    return(
        <div className='report-item__container'>
            <h3 style={{color: 'green', fontWeight:' bold'}}>Report #1</h3>
            <div className='report-item__card-info'>
                <p className='report-item__title-cards'>Reported by: </p>
                <a href='#'>0x2979CdF22c23166Ae9DcCA8f4BE761fB34d3E666</a>
            </div>
            <div className='report-item__card-info'>
                <p className='report-item__title-cards'>Accused producer: </p>
                <a href='#'>0x6E5e3A0F8ba4a999bEa5E0CE611232F5A0654957</a>
            </div>
            <div className='report-item__card-info'>
                <p className='report-item__title-cards'>Accused activist: </p>
                <a href='#'>0x3f77F41d44C59261F0BeD809936f1D399CF3dF8A</a>
            </div>

            <div className='report-item__description-report'>
                <div className='report-item__card-description-report'>
                    <p style={{color: 'green', fontWeight:'bold', marginBottom: 0}}>Testimony</p>
                    <p className='report-item__text-testemony'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
                <div className='report-item__card-description-report'>
                    <p style={{color: 'green', fontWeight:'bold', marginBottom: 0}}>Photo</p>
                    <img src={FarmImg} className='report-item__photo'/>
                </div>
            </div>
        </div>
    )
}