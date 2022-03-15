import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {useParams} from "react-router-dom"
import { updateBreadcrumb } from '../redux/breadcrumb_slices';

function DetailBookUser() {
    const {genre,id_book}=useParams()
    console.log(genre,id_book)
    const dispatch=useDispatch()
    // từ id_book lấy ra name_book rồi bỏ vào breadcrumb @@
    useEffect(()=>{
        const breadcrum={
            genre:genre,
            name_book:id_book
        }
        dispatch(updateBreadcrumb(breadcrum))
    },[])
    return (
        <div>
            
        </div>
    );
}

export default DetailBookUser;