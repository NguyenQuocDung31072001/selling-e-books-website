import { Table, Tag, Space, Button } from 'antd'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import LoginAndRegister from '../component/login_register'
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green'
          if (tag === 'loser') {
            color = 'volcano'
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          )
        })}
      </>
    )
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    )
  }
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
]

export default function Cart() {
  const currentUser = useSelector(state => state.auth.login.currentUser)
  console.log(currentUser)
  return (
    <div className="flex justify-between  mx-[20px] ">
      {!currentUser && <LoginAndRegister />}
      {currentUser && (
        <div>
          <div className="w-[800px]">
            <Table
              pagination={{ pageSize: 10 }}
              columns={columns}
              dataSource={data}
            />
          </div>
          <div className="flex flex-col-reverse w-[600px] h-[600px] bg-white">
            <Button>Mua hàng</Button>
          </div>
        </div>
      )}
    </div>
  )
}
