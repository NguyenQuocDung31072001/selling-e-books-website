import {
  Button,
  Col,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Radio,
  Checkbox,
  Space,
  Upload,
  Spin
} from 'antd'
import { useState } from 'react'
import moment from 'moment'
import { createNewVoucher, updateVoucher } from '../../redux/api_request'
import {
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
  RedoOutlined,
  UploadOutlined
} from '@ant-design/icons'
import { openNotification } from '../../utils/notification'

export default function VoucherDetailModal(props) {
  const { data, onClose, onUpdate, onError, visible } = props
  const [type, setType] = useState(
    data && typeof data.discountPercentage !== 'undefined' ? 1 : 2
  )
  const [isLimited, setIsLimited] = useState(
    data && typeof data.limit !== 'undefined' ? 1 : 2
  )
  const [discountLimit, setDiscountLimit] = useState(
    data &&
      typeof data.discountPercentage !== 'undefined' &&
      typeof data.discountCap !== 'undefined'
      ? true
      : false
  )

  const [imageUrl, setImageUrl] = useState(
    data && typeof data.imageUrl !== 'undefined' ? data.imageUrl : ''
  )
  const [imageBase64, setImageBase64] = useState()

  const [loading, setLoading] = useState(false)

  const { RangePicker } = DatePicker

  const saveUpdateVoucher = async value => {
    if (data) {
      setLoading(true)
      const voucher = {
        ...value,
        startTime: value.time[0].toDate(),
        endTime: value.time[1].toDate(),
        _id: data._id,
        image: imageBase64
      }
      const res = await updateVoucher(voucher)
      if (res.success) {
        onUpdate(res.voucher)
        openNotification(
          'success',
          'Cập nhật thông tin thành công!',
          'Thông tin mã khuyến mãi đã được cập nhật thành công!'
        )
      } else {
        onError(res.message)
        openNotification(
          'error',
          'Cập nhật thông tin không thành công!',
          'Thông tin mã khuyến mãi cập nhật không thành công!'
        )
      }
      setLoading(false)
    } else {
      setLoading(true)
      const voucher = {
        ...value,
        startTime: value.time[0].toDate(),
        endTime: value.time[1].toDate(),
        image: imageBase64
      }
      const res = await createNewVoucher(voucher)
      if (res.success) {
        onUpdate(res.voucher)
        openNotification(
          'success',
          'Cập nhật thông tin thành công!',
          'Thông tin mã khuyến mãi đã được cập nhật thành công!'
        )
      } else {
        onError(res.message)
        openNotification(
          'error',
          'Cập nhật thông tin không thành công!',
          'Thông tin mã khuyến mãi cập nhật không thành công!'
        )
      }
      setLoading(false)
    }
  }

  const handleChangeImage = e => {
    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onloadend = () => {
      setImageUrl(URL.createObjectURL(e.target.files[0]))
      setImageBase64(reader.result)
    }
    reader.onerror = () => {
      console.error('error!!')
    }
  }

  return (
    <>
      <Modal
        title="Voucher"
        visible={visible}
        // onOk={handleOk}
        // confirmLoading={confirmLoading}
        onCancel={onClose}
        width={768}
        footer={null}
      >
        <div
          className={`mb-3 relative  ${
            imageUrl
              ? ''
              : 'border-2 border-dashed border-emerald-600 w-full h-52 '
          }`}
        >
          <input
            type="file"
            id="image"
            className={`opacity-0 cursor-pointer ${
              imageUrl ? '' : 'w-full h-full'
            }`}
            onChange={handleChangeImage}
          />
          {imageUrl && <img src={imageUrl} alt=" w-full" className="" />}
          <label
            htmlFor="image"
            className={`${
              imageUrl
                ? 'mt-2'
                : 'absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2'
            } cursor-pointer flex flex-row space-x-1 items-center font-medium text-lg justify-center text-blue-800`}
          >
            <span>{imageUrl ? 'Thay đổi' : 'Tải lên'}</span>
            {imageUrl ? <EditOutlined /> : <UploadOutlined />}
          </label>
        </div>

        <Form
          name="voucher"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={saveUpdateVoucher}
          initialValues={
            data
              ? {
                  code: data.code,
                  discountPercentage: data.discountPercentage,
                  discountCap: data.discountCap,
                  limit: data.limit,
                  minSpend: data.minSpend,
                  time: [moment(data.startTime), moment(data.endTime)],
                  description: data.description,
                  disabled: data.disabled
                }
              : {}
          }
        >
          <Form.Item
            name="code"
            label="Mã voucher"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mã khuyến mãi!'
              }
            ]}
          >
            <Input disabled={data ? true : false} style={{ color: 'black' }} />
          </Form.Item>

          <Form.Item
            // name="isLimit"
            label="Số lượng"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập số lượng mã khuyến mãi!'
              }
            ]}
          >
            <Radio.Group
              onChange={e => {
                setIsLimited(e.target.value)
              }}
              value={isLimited}
            >
              <Radio value={1}>Số lượng có hạn</Radio>
              <Radio value={2}>Không giới hạn</Radio>
            </Radio.Group>
          </Form.Item>

          {isLimited === 1 && (
            <Form.Item
              name="limit"
              label="Số lượng tối đa"
              rules={[
                {
                  required: true,
                  type: 'number',
                  message: 'Vui lòng nhập số lượng mã khuyến mãi tối đa!'
                }
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          )}

          <Form.Item
            name="time"
            label="Thời gian khuyến mãi"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập thời gian khuyến mãi!'
              }
            ]}
          >
            <RangePicker
              showTime
              placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
              style={{ width: '100%' }}
              format={'HH:mm:ss DD-MM-YYYY'}
            />
          </Form.Item>

          <Form.Item
            name="minSpend"
            label="Mức chi tối thiểu (đ)"
            rules={[
              {
                type: 'number',
                required: true,
                message:
                  'Vui lòng nhập mức chi tiêu tối thiểu được sử dụng khuyến mãi tối đa!'
              }
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Loại mã giảm">
            <Radio.Group
              onChange={e => {
                setType(e.target.value)
              }}
              value={type}
            >
              <Radio value={1}>Giảm theo tỉ lệ</Radio>
              <Radio value={2}>Giảm theo mức cố định</Radio>
            </Radio.Group>
          </Form.Item>
          {type == 1 && (
            <>
              <Form.Item
                name="discountPercentage"
                label="Tỉ lệ giảm (%)"
                rules={[
                  {
                    type: 'number',
                    min: 0,
                    required: true,
                    message: 'Vui lòng nhập tỉ lệ khuyến mãi!'
                  }
                ]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                wrapperCol={{ offset: 6, span: 18 }}
                valuePropName="checked"
              >
                <Checkbox
                  checked={discountLimit}
                  onChange={e => {
                    setDiscountLimit(e.target.checked)
                  }}
                >
                  Áp dụng mức khuyến mãi tối đa
                </Checkbox>
              </Form.Item>
              {discountLimit === true && (
                <Form.Item
                  name="discountCap"
                  label="Mức giảm tối đa (đ)"
                  rules={[
                    {
                      type: 'number',
                      min: 0,
                      required: true,
                      message: 'Vui lòng nhập mức giảm tối đa!'
                    }
                  ]}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              )}
            </>
          )}
          {type === 2 && (
            <Form.Item
              name="discountCap"
              label="Mức giảm (đ)"
              rules={[
                {
                  type: 'number',
                  min: 0,
                  required: true,
                  message: 'Vui lòng nhập mức giảm khuyến mãi!'
                }
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          )}
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mô tả cho khuyễn mãi!'
              }
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="disabled"
            label="Tình trạng"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn tình trạng!'
              }
            ]}
          >
            <Radio.Group>
              <Radio value={false}>Khả dụng</Radio>
              <Radio value={true}>Dừng khuyến mãi</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Space size={16}>
              <Button type="primary" htmlType="submit" disabled={loading}>
                {loading && <Spin style={{ marginRight: '10px' }} />}
                Lưu
              </Button>
              <Button type="" onClick={onClose}>
                Hủy bỏ
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
