import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {useNavigate} from "react-router-dom"

function NotFound() {
    const navigate=useNavigate()
    useEffect(()=>{
        navigate('/login')
    },[])
    return (
        <div>
            
        </div>
    );
}

export default NotFound;