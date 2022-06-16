import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  UndoOutlined
} from '@ant-design/icons'
import { Modal } from 'antd'
import { useDispatch } from 'react-redux'
import { hardDeleteAuthor, restoreDeletedAuthor } from '../../redux/api_request'
import { openNotification } from '../../utils/notification'
function DeletedAuthorRow(data) {
  const { author, className } = data
  const dispatch = useDispatch()
  const { confirm } = Modal
  const deleteAuthor = async () => {
    confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content:
        'Dữ liệu về tác giả sẽ bị xóa hoàn toàn khỏi hệ thống! Bạn có muốn tiếp tục',
      okText: 'Tiếp tục',
      cancelText: 'Hủy',
      onOk() {
        const handleDelete = async () => {
          const result = await hardDeleteAuthor(dispatch, author)
          openNotification(
            'success',
            'Xóa thành công!',
            'Thông tin tác giả đã được xóa thành công!'
          )
        }
        handleDelete()
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  const restoreAuthor = async () => {
    console.log('restore')
    const result = await restoreDeletedAuthor(dispatch, author)
    openNotification(
      'success',
      'Khôi phục thành công!',
      'Thông tin tác giả đã được khôi phục thành công!'
    )
    console.log(result)
  }

  return (
    <>
      <tr className={`hover:bg-slate-100 ${className}`}>
        <td className="border">
          <div className="flex flex-row justify-evenly items-center space-x-1 text-lg">
            <button onClick={restoreAuthor}>
              <UndoOutlined style={{ color: '#4D96FF' }} />
            </button>
            <button onClick={deleteAuthor}>
              <DeleteOutlined style={{ color: '#FF6B6B' }} />
            </button>
          </div>
        </td>

        <td className="border text-base text-gray-700 font-normal relative">
          <img
            src={author.avatarUrl}
            alt={author.fullName}
            className="rounded-full w-12 h-12 object-cover"
          />
        </td>
        <td className="border text-base text-gray-700 font-normal py-2 px-2 text-left">
          <input
            type="text"
            name="fullName"
            value={author.fullName}
            disabled
            placeholder="Họ Tên"
            className="disabled:bg-transparent px-2 py-[0.4rem] w-full text-left border-0 outline-none disabled:ring-0"
            readOnly
          />
        </td>
        <td className="border text-base text-gray-700 font-normal py-2 px-2 text-left">
          <input
            type="date"
            name="birthDate"
            value={author.birthDate.split('T')[0]}
            disabled
            placeholder="Ngày sinh"
            className="disabled:bg-transparent px-2 py-[0.4rem] w-full text-left border-0 outline-none disabled:ring-0"
            readOnly
          />
        </td>
        <td className="border text-base text-gray-700 font-normal py-2 px-2 text-left">
          <input
            type="text"
            name="address"
            value={author.address}
            disabled
            placeholder="Địa chỉ"
            className="disabled:bg-transparent px-2 py-[0.4rem] w-full text-left border-0 outline-none disabled:ring-0"
            readOnly
          />
        </td>
      </tr>
    </>
  )
}

export default DeletedAuthorRow
