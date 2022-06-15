import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { Button, Modal, Space, Tooltip } from 'antd'
import { useState } from 'react'
import { deleteVoucher } from '../../redux/api_request'
import { openNotification } from '../../utils/notification'
import VoucherDetailModal from './detail_modal'

function VoucherActionContainer(props) {
  const { data, onUpdate, onDelete, onError, ...other } = props
  const [openModal, setOpenModal] = useState(false)
  const { confirm } = Modal
  const hideModal = () => {
    setOpenModal(false)
  }

  const updatedVoucher = data => {
    onUpdate(data)
    hideModal()
  }
  const showModal = () => {
    setOpenModal(true)
  }

  const fncDeleteVoucher = async () => {
    confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content:
        'Dữ liệu về mã giảm giá sẽ bị xóa hoàn toàn khỏi hệ thống! Bạn có muốn tiếp tục',
      okText: 'Tiếp tục',
      cancelText: 'Hủy',
      onOk() {
        handleDelete()
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  const handleDelete = async () => {
    const result = await deleteVoucher(data)
    if (result.success) {
      onDelete(data)
      openNotification(
        'success',
        'Xóa thành công!',
        'Thông tin mã khuyến mãi đã được xóa thành công!'
      )
    } else {
      onError('Không thành công!')
      openNotification(
        'error',
        'Xóa không thành công!',
        'Xóa thông tin mã khuyến mãi không thành công!'
      )
    }
  }

  return (
    <Space size="middle">
      <Tooltip title="Chỉnh sửa">
        <Button
          shape="circle"
          icon={<EditOutlined />}
          onClick={showModal}
          className="md:invisible lg:visible"
        />
      </Tooltip>

      <Tooltip title="Xóa">
        <Button
          shape="circle"
          icon={<DeleteOutlined />}
          onClick={fncDeleteVoucher}
          className="md:invisible lg:visible"
        />
      </Tooltip>
      {openModal && (
        <VoucherDetailModal
          data={data}
          visible={openModal}
          onClose={hideModal}
          onUpdate={updatedVoucher}
        />
      )}
    </Space>
  )
}

export default VoucherActionContainer
