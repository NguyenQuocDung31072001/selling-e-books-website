import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu,Typography } from 'antd'
import {
  SettingOutlined,
  AppstoreAddOutlined,
  AreaChartOutlined
} from '@ant-design/icons'
import {
  getAllGenresForAddBook,
  getAllAuthorForAddBook
} from '../redux/api_request'
const { SubMenu } = Menu
const {Title}=Typography
function SideBar() {
  const [allGenres, setAllGenres] = useState([])
  const [allAuthors, setAllAuthors] = useState([])
  const handleClick = e => {
    console.log(e)
  }
  useEffect(() => {
    ;(async function () {
      //load api lấy tất cả thể loại
      const allGenre = await getAllGenresForAddBook()
      const allGenreName = []
      for (let i = 0; i < allGenre.length; i++) {
        allGenreName.push({
            name:allGenre[i].name,
            slug:allGenre[i].slug
        })
      }
      setAllGenres(allGenreName)
    })()
    ;(async function () {
      //load api lấy tất cả tác giả
      const allAuthor = await getAllAuthorForAddBook()
      const allAuthorName = []
      for (let i = 0; i < allAuthor.length; i++) {
        allAuthorName.push({
            name:allAuthor[i].fullName,
            slug:allAuthor[i].slug
        })
      }
      setAllAuthors(allAuthorName)
    })()
  }, [])
  useEffect(()=>{
      console.log(allAuthors)
  },[allAuthors])
  return (
    <div className="w-[300px] h-full bg-white overflow-y-auto fixed top-0 left-0">
        <div className='text-green-500'>
            <Link to='/user/home'>
                <Title level={3} style={{color:'green', fontWeight:800}}>Book Sto</Title>
            </Link>
        </div>
      <Menu
        onClick={handleClick}
        style={{ width: 300 }}
        // defaultSelectedKeys={['1']}
        // defaultOpenKeys={['sub1']}
        mode="inline"
        theme="light"
      >
        <Menu.Item icon={<AreaChartOutlined />} key="dashboard">
          <Link to="/user/home">HomePage</Link>
        </Menu.Item>
        <Menu.Item icon={<AreaChartOutlined />} key="category">
          <Link to="/user/category">Category Book</Link>
        </Menu.Item>

        <SubMenu key="sub2" icon={<SettingOutlined />} title="Thể loại">
            {allGenres.length>0 && allGenres.map((genres,index)=>{
                return <Menu.Item icon={<AppstoreAddOutlined />} key={index+'genres'}>
                <Link key={index+'link genres'} to={`/user/home/${genres.slug}`}>{genres.name}</Link>
            </Menu.Item>
            })}
        </SubMenu>
        <SubMenu key="sub3" icon={<SettingOutlined />} title="Tác Giả">
            {allAuthors.length>0 && allAuthors.map((authors,index)=>(
                <Menu.Item icon={<AppstoreAddOutlined />} key={index+'authors'}>
                    <Link to={`/user/home/${authors.slug}`}>{authors.name}</Link>
                </Menu.Item>
            ))}
        </SubMenu>
      </Menu>
    </div>
  )
}

export default SideBar
