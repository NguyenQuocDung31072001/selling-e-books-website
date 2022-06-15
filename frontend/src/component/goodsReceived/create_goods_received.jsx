import {
  ConsoleSqlOutlined,
  DownloadOutlined,
  ImportOutlined
} from '@ant-design/icons'
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Spin,
  Tooltip
} from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import {
  createNewGoodsReceived,
  getAllBookForAdmin
} from '../../redux/api_request'
const { Option } = Select

function NewGoodsReceivedModal(props) {
  const { book, label, onLoading, onError, onSuccess, buttonSize, buttonType } =
    props
  const [visible, setVisible] = useState(false)
  const [bookList, setBookList] = useState([])
  const [bookReceived, setBookReceived] = useState(book !== undefined && book)
  const [loading, setLoading] = useState(false)
  const saveNewGoodsReceived = async data => {
    if (onLoading) onLoading()
    setLoading(true)
    const result = await createNewGoodsReceived({
      book: data.book,
      quantity: data.quantity,
      price: data.price,
      date: data.date
    })
    if (result.success) {
      setLoading(false)
      handleCancel()
      if (onSuccess) onSuccess(result.goodsReceived)
    } else {
      setLoading(false)
      if (onError)
        onError(
          'Nhập sách không thành công!',
          'Bạn vui lòng kiểm tra lại thông tin nhập sách và kết nối của bạn!'
        )
    }
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const handleOpenForm = () => {
    setVisible(true)
  }

  const handleChangeBookImport = id => {
    const newBookImport = bookList.find(book => book._id == id)
    setBookReceived(newBookImport)
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

  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue({
      book: bookReceived?._id || '',
      bookName: bookReceived?.name || '',
      quantity: 0,
      price: 0,
      date: moment()
    })
  }, [form, bookReceived])

  return (
    <>
      <Tooltip title="Nhập sách">
        <Button
          shape={label !== undefined ? 'round' : 'circle'}
          size={buttonSize || 'large'}
          type={buttonType || 'primary'}
          icon={<ImportOutlined className="align-[0.125em]" />}
          onClick={handleOpenForm}
        >
          {label || ''}
        </Button>
      </Tooltip>
      {visible && (
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
                defaultValue={bookReceived?._id || bookList[0]?._id}
              >
                {bookList.map(book => {
                  return (
                    <Option key={book._id} value={book._id}>
                      {book.name}
                    </Option>
                  )
                })}
              </Select>
            </div>
          )}
          <Form
            form={form}
            name="goodsReceived"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            initialValues={{
              book: bookReceived?._id || '',
              bookName: bookReceived?.name || '',
              quantity: 0,
              price: 0,
              date: moment()
            }}
            onFinish={saveNewGoodsReceived}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="ID Sách"
              name="book"
              rules={[
                { required: true, message: 'Vui lòng chọn sách cần nhập!' }
              ]}
            >
              <Input size="large" disabled className="text-black" />
            </Form.Item>

            <Form.Item
              label="Tên sách"
              name="bookName"
              rules={[
                { required: true, message: 'Vui lòng chọn sách cần nhập!' }
              ]}
            >
              <Input size="large" disabled className="text-black" />
            </Form.Item>

            <Form.Item
              label="Số lượng"
              name="quantity"
              rules={[
                { required: true, message: 'Vui lòng nhập số lượng sách!' },
                {
                  type: 'number',
                  min: 0,
                  message: 'Số lượng sách nhập vào phải >= 0!'
                }
              ]}
            >
              <InputNumber size="large" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Đơn giá"
              name="price"
              rules={[
                { required: true, message: 'Vui lòng nhập số đơn giá sách!' },
                {
                  type: 'number',
                  min: 0,
                  message: 'Giá sách nhập vào phải >= 0!'
                }
              ]}
            >
              <InputNumber size="large" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Ngày nhập"
              name="date"
              rules={[
                { required: true, message: 'Vui lòng nhập ngày nhập sách!' }
              ]}
            >
              <DatePicker size="large" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 6,
                span: 18
              }}
            >
              <div className="flex flex-row space-x-6">
                <Button htmlType="submit" type="primary" disabled={loading}>
                  {loading && <Spin style={{ marginRight: '10px' }} />}
                  Hoàn tất
                </Button>
                <Button onClick={handleCancel}>Hủy bỏ</Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  )
}

export default NewGoodsReceivedModal
