import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
const typeBook = [
    'Chính trị - pháp luật',
    'Khoa học công nghệ',
    'Kinh tế',
    'Văn học nghệ thuật',
    'Văn hóa xã hội - Lịch sử',
    'Giáo trình',
    'Truyện, tiểu thuyết',
    'Tâm lý, tâm linh, tôn giáo',
    'Sách thiếu nhi'
  ]

function BreadcrumbsUser() {
    const breadcrumb_value=useSelector(state=>state.breadcrumb.breadcrumb)
    let {genre,name_book}={...breadcrumb_value}

    useEffect(()=>{
        genre=breadcrumb_value.genre
        name_book=breadcrumb_value.name_book
    
    },[breadcrumb_value])
    
    return (
        <div>
            {genre && !name_book &&  (
                <div className='flex'>
                    <Link to="/user/home">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <span>{genre}</span>
                </div>
            )}

            {genre && name_book && (
                <div className='flex'>
                    <Link to="/user/home">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <Link to={`/user/home/${genre}`}>
                        {genre}
                    </Link>
                    <span>/</span>
                    <span>{name_book}</span>

                </div>
            )}
            {!genre && (
                <div className='flex min-w-max'>
                    {typeBook.map((type,key)=>(
                        <div className='mx-[10px] cursor-pointer hover:text-blue-900' key={key} >
                            <Link to={`/user/home/${type}`}>
                            {type}
                            </Link>
                            
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BreadcrumbsUser;