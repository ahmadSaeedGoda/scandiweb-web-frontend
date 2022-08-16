import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({handleMassDelete}) {

    const navigate = useNavigate();
    
    return (
        <>
            <nav>
                <div className='nav-brand-main'>Product List</div>
                <button type="button" className="btn" onClick={() => navigate("/add-product")}>ADD</button>
                <button type="button" className="btn btn-danger" id="products-mass-delete-btn"
                    onClick={handleMassDelete}>MASS DELETE</button>
            </nav>
            <hr/>
        </>
    )
}
