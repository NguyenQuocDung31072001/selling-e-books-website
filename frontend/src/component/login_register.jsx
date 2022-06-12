import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Input, Checkbox } from 'antd'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginApi, registerApi } from '../redux/api_request'

function LoginAndRegister() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorEmail, setErrorEmail] = useState()
  const [errorPassword, setErrorPassword] = useState()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const showModal = () => {
    setIsModalVisible(true)
    setIsLogin(true)
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  useEffect(() => {
    setEmail('')
    setPassword('')
  }, [isLogin])

  const loginSubmit = e => {
    e.preventDefault()
    const user = {
      email: email,
      password: password
    }

    ;(async function () {
      let result = await loginApi(user, dispatch, navigate)
      console.log('result login', result)
      if (result.success === false) {
        if (result.errorEmail) {
          setErrorEmail(result.message)
          setErrorPassword()
        }
        if (result.errorPassword) {
          setErrorPassword(result.message)
          setErrorEmail()
        }
      }
    })()
  }

  const registerSubmit = e => {
    e.preventDefault()
    const user = {
      email: email,
      password: password
    }
    // registerApi(user, dispatch)
    ;(async function () {
      let result = await registerApi(user, dispatch)
      console.log('result register', result)
      if (result.success === false) {
        if (result.errorEmail) {
          setErrorEmail(result.message)
          setErrorPassword()
        }
        if (result.errorPassword) {
          setErrorPassword(result.message)
          setErrorEmail()
        }
      } else {
        setIsLogin(true)
      }
    })()
  }
  useEffect(() => {
    setErrorEmail()
    setErrorPassword()
  }, [isLogin])
  return (
    <div>
      <div className=" cursor-pointer" onClick={showModal}>
        <p className="text-blue-700">Đăng nhập/Đăng kí</p>
      </div>
      {isLogin && (
        <Modal
          title="Đăng nhập"
          visible={isModalVisible}
          width={400}
          onCancel={handleCancel}
          footer={null}
          cancelButtonProps
        >
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            className="flex flex-col "
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input onChange={e => setEmail(e.target.value)} />
              {errorEmail && <p className="text-red-500">{`*${errorEmail}`}</p>}
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' }
              ]}
            >
              <Input.Password onChange={e => setPassword(e.target.value)} />
              {errorPassword && (
                <p className="text-red-500">{`*${errorPassword}`}</p>
              )}
            </Form.Item>
            {/* <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox onChange={e => console.log(e.target.checked)}>
                Remember me
              </Checkbox>
            </Form.Item> */}

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" onClick={loginSubmit}>
                Đăng nhập
              </Button>
            </Form.Item>
            <Form.Item className="flex flex-col items-center justify-center">
              <p
                className="text-sky-500 cursor-pointer"
                onClick={() => navigate('/forgotPassword')}
              >
                Quên mật khẩu
              </p>
              <p
                className="text-sky-500 cursor-pointer"
                onClick={() => setIsLogin(false)}
              >
                Đăng ký tài khoản
              </p>
            </Form.Item>
          </Form>
        </Modal>
      )}
      {!isLogin && (
        <Modal
          title="Đăng kí"
          visible={isModalVisible}
          width={400}
          onCancel={handleCancel}
          footer={null}
          cancelButtonProps
        >
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input onChange={e => setEmail(e.target.value)} />
              {errorEmail && <p className="text-red-500">{`*${errorEmail}`}</p>}
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' }
              ]}
            >
              <Input.Password onChange={e => setPassword(e.target.value)} />
              {errorPassword && (
                <p className="text-red-500">{`*${errorPassword}`}</p>
              )}
            </Form.Item>

            {/* <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox onChange={e => console.log(e.target.checked)}>
                Remember me
              </Checkbox>
            </Form.Item> */}

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" onClick={registerSubmit}>
                Đăng kí
              </Button>
            </Form.Item>
            <Form.Item className="flex justify-center">
              <span>Nếu bạn đã có tài khoản hãy </span>
              <span
                className="text-sky-500 cursor-pointer"
                onClick={() => setIsLogin(true)}
              >
                Đăng nhập
              </span>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  )
}

export default LoginAndRegister
