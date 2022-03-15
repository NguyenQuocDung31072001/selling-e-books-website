import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginApi } from '../redux/api_request'
import { TextField, Button } from '@mui/material'

export default function LoginPages() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const loginSubmit = e => {
    e.preventDefault()
    const user = {
      email: email,
      password: password
    }
    loginApi(user, dispatch, navigate)
  }

  return (
    <div className="h-screen flex justify-center items-center  ">
      <div className="w-screen h-screen fixed ">
        <img
          className="w-full h-full object-cover"
          src="https://thumbs.dreamstime.com/b/modern-ebook-reader-books-man-taking-bookshelf-107296999.jpg"
        />
      </div>
      <div className="w-[300px] h-[350px] flex flex-col justify-center items-center bg-white rounded-[10px] z-10">
        <form
          className="flex flex-col justify-center items-center w-[260px] h-full relative "
          action=""
          // onSubmit={loginSubmit}
        >
          <div className="flex flex-col justify-center items-center bg-sky-600 w-[260px] h-[80px] absolute top-[-20px] rounded-xl text-white text-[20px]">
            <h2>Sign in</h2>
          </div>

          <div className=" mb-[10px]">
            <TextField
              className="w-[260px]"
              type="text"
              label="Email"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className=" mb-[20px]">
            <TextField
              className="w-[260px]"
              type="password"
              label="Password"
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <Button className="w-full" variant="contained" onClick={loginSubmit}>
            Sign in
          </Button>
          <div className="absolute bottom-[20px] ">
            <span>
              If you don't have account?
              <Link className="text-sky-600" to="/register">
                Register
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
