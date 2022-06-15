import { ImportOutlined } from '@ant-design/icons'
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Tooltip
} from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { getAllBookForAdmin } from '../../redux/api_request'
const { Option } = Select

function ImportBook(props) {
  const { book } = props

  const [visible, setVisible] = useState(false)
  const [bookList, setBookList] = useState([])
  const [bookImport, setBookImport] = useState(book !== undefined && book)
  const handleImportBook = data => {
    console.log(data)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const handleOpenImportForm = () => {
    setVisible(true)
  }

  const handleChangeBookImport = e => {
    const newBookImport = bookList.find(book => book._id == e.target.value)
    setBookImport(newBookImport)
  }

  useEffect(() => {
    if (book == undefined) {
      const getAllBook = async () => {
        const _bookList = await getAllBookForAdmin()
        setBookList(_bookList)
      }
      getAllBook()
    }
  }, [])

  return (
    <>
      <Tooltip title="Nhập sách">
        <Button
          shape="circle"
          icon={<ImportOutlined />}
          onClick={handleOpenImportForm}
        />
      </Tooltip>
      <Modal
        title="Nhập sách"
        visible={visible}
        footer={null}
        onCancel={handleCancel}
      >
        {book == undefined && (
          <div className="mb-8">
            <Select
              placeholder="Sách cần nhập"
              onChange={handleChangeBookImport}
              style={{ width: '100%' }}
              size="large"
              allowClear
            >
              {bookList.map(book => {
                return <Option value={book._id}>{book.name}</Option>
              })}
            </Select>
          </div>
        )}

        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          name="import book"
          onFinish={handleImportBook}
          initialValues={{
            book: book._id,
            name: book.name,
            quantity: 0,
            price: 0,
            time: moment()
          }}
        >
          <Form.Item
            name="book"
            label="ID"
            rules={[
              { required: true, message: 'Vui lòng chọn sách cần nhập!' }
            ]}
          >
            <Input size="large" disabled className="text-black" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên sách"
            rules={[
              { required: true, message: 'Vui lòng chọn sách cần nhập!' }
            ]}
          >
            <Input size="large" disabled className="text-black" />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng sách!' }
            ]}
          >
            <InputNumber size="large" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Đơn giá"
            rules={[{ required: true, message: 'Vui lòng nhập đơn giá sách!' }]}
          >
            <InputNumber
              size="large"
              style={{ width: '100%' }}
              addonAfter="₫"
            />
          </Form.Item>
          <Form.Item
            name="time"
            label="Ngày nhập"
            rules={[
              { required: true, message: 'Vui lòng nhập ngày nhập sách!' }
            ]}
          >
            <DatePicker size="large" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16
            }}
          >
            <div className="flex flex-row space-x-2">
              <Button htmlType="button" onClick={handleCancel}>
                Hủy bỏ
              </Button>
              <Button type="primary" htmlType="submit">
                Hoàn thành
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ImportBook
