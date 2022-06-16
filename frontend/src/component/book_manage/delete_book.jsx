import { Button, Tooltip } from 'antd'
import React from 'react'
import { softDeleteBook } from '../../redux/api_request'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'

function DeleteBook(props) {
  const { confirm } = Modal
  const { book, onDeleted, onError } = props
  const handleDeleteBook = async () => {
    confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: 'Dữ liệu về sách sẽ bị xóa! Bạn có muốn tiếp tục',
      okText: 'Tiếp tục',
      cancelText: 'Hủy',
      onOk() {
        const handleDelete = async () => {
          const result = await softDeleteBook(book._id)
          if (result.success) {
            onDeleted(book)
          } else {
            if (onError)
              onError(
                'Xóa không thành công!',
                'Bạn vui lòng kiểm tra lại kết nối của bạn!'
              )
          }
        }
        handleDelete()
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }
  return (
    <Tooltip title="Xóa">
      <Button
        shape="circle"
        icon={<DeleteOutlined />}
        onClick={handleDeleteBook}
      />
    </Tooltip>
  )
}

export default DeleteBook
