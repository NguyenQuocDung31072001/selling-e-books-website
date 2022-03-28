import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {useParams} from "react-router-dom"
import {updateBreadcrumb} from "../redux/breadcrumb_slices"

function GenreBookUser() {
    const {genre}=useParams()
    
    const dispatch=useDispatch()
    useEffect(()=>{
        const breadcrumb={genre:genre,name_book:''}
        dispatch(updateBreadcrumb(breadcrumb))
    },[genre])
    return (
        <div>
            
        </div>
    );
}

export default GenreBookUser;