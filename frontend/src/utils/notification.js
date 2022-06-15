import { MehOutlined, SmileOutlined } from '@ant-design/icons'
import { notification } from 'antd'

export function openNotification(type, message, description) {
  notification.open({
    message: message,
    description: description,
    icon:
      type == 'success' ? (
        <SmileOutlined style={{ color: '#52c41a' }} />
      ) : (
        <MehOutlined style={{ color: '#ff4d4f' }} />
      )
  })
}
