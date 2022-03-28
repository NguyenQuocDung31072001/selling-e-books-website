import { Button, Input, DatePicker, Space, Select } from 'antd'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { addBook } from '../redux/api_request'
const { TextArea } = Input
const { Option } = Select
function AddBook() {
  const [imageBook, setImageBook] = useState()
  const [nameBook, setNameBook] = useState()
  const [pushlishBy, setPushlishBy] = useState()
  const [page, setPage] = useState()
  const [amount, setAmount] = useState()
  const [pushlishDate, setPushlishDate] = useState()
  const [author, setAuthor] = useState()
  const [price, setPrice] = useState()
  const [genre, setGenre] = useState()
  const [decription, setDecription] = useState()
  const [imageBase64, setImageBase64] = useState()
  const date = new Date()
  const defaultDate =
    date.getFullYear() + '-' + `${date.getMonth() + 1}` + '-' + date.getDate()

  const changeImageBook = e => {
    // console.log(e.target.files[0])
    setImageBook(e.target.files[0])
  }
  useEffect(() => {
    if (imageBook) {
      const reader = new FileReader()
      reader.readAsDataURL(imageBook)
      reader.onloadend = () => {
        // console.log(reader.result)
        setImageBase64(reader.result)
      }
      reader.onerror = () => {
        console.error('AHHHHHHHH!!')
      }
    }
  }, [imageBook])

  const handleAddBook = () => {
    let book = {
      base64Image: imageBase64,
      name: nameBook,
      publishedBy: pushlishBy,
      pages: page,
      amount: amount,
      // pushlishDate: pushlishDate,
      authors: author,
      price: price,
      genres: genre,
      description: decription
    }
    addBook(book)
    // console.log(book)
  }
  return (
    <div>
      <div className="flex">
        <div className=" w-screen h-[50px] bg-sky-600 fixed top-0 z-10">
          Thêm sách
        </div>
        <div className="flex justify-center w-[350px] mt-[100px] ml-[20px] h-[450px] rounded-lg shadow-xl bg-gray-50 border-dashed border-2">
          <div className="">
            <label className="inline-block mb-2 text-gray-500">
              File Upload
            </label>
            <div className="flex items-center justify-center w-full">
              {imageBook && <img src={URL.createObjectURL(imageBook)} alt="" />}
              {!imageBook && (
                <label className="flex flex-col w-full h-[350px] border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                      Attach a file
                    </p>
                  </div>
                  <input
                    type="file"
                    className="opacity-0"
                    onChange={changeImageBook}
                  />
                </label>
              )}
            </div>
            <Button onClick={() => setImageBook('')}>reset</Button>
          </div>
        </div>
        <div className="w-[400px] h-[450px] ml-[20px] mt-[100px]">
          <div className="flex mb-[20px]">
            <label className="w-[120px]">Name book</label>
            <Input
              placeholder="Name"
              onChange={e => setNameBook(e.target.value)}
            />
          </div>
          <div className="flex mb-[20px]">
            <label className="w-[120px]">PushlishBy</label>
            <Input
              placeholder="PushlishBy"
              onChange={e => setPushlishBy(e.target.value)}
            />
          </div>
          <div className="flex mb-[20px]">
            <label className="w-[120px]">Pages</label>
            <Input
              placeholder="Pages"
              onChange={e => setPage(e.target.value)}
            />
          </div>
          <div className="flex mb-[20px]">
            <label className="w-[120px]">Amount</label>
            <Input
              placeholder="Amount"
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          <div className="flex mb-[20px]">
            <label className="w-[100px]">PushlishDate</label>
            <DatePicker
              style={{ width: 320 }}
              defaultValue={moment(`${defaultDate}`, 'YYYY-MM-DD')}
              onChange={(date, id) => setPushlishDate(id)}
              // onChange={(date,id)=>console.log(id)}
            />
          </div>
        </div>
        <div className="w-[400px] h-[450px] ml-[20px] mt-[100px]">
          <div className="flex mb-[20px]">
            <label className="w-[120px]">Author</label>
            <Input
              placeholder="Author"
              onChange={e => setAuthor(e.target.value)}
            />
          </div>
          <div className="flex mb-[20px]">
            <label className="w-[120px]">Price</label>
            <Input
              placeholder="Price"
              onChange={e => setPrice(e.target.value)}
            />
          </div>
          <div className="flex mb-[20px]">
            <label className="w-[100px]">Genres</label>
            <Select
              defaultValue="Chính trị - pháp luật"
              style={{ width: 320 }}
              onChange={e => setGenre(e)}
            >
              <Option value="Chính trị - pháp luật">
                Chính trị - pháp luật
              </Option>
              <Option value="Khoa học công nghệ">Khoa học công nghệ</Option>
              <Option value="Kinh tế">Kinh tế</Option>
              <Option value="Văn học nghệ thuật">Văn học nghệ thuật</Option>
              <Option value="Văn hóa xã hội - Lịch sử">
                Văn hóa xã hội - Lịch sử
              </Option>
              <Option value="Giáo trình">Giáo trình</Option>
              <Option value="Truyện, tiểu thuyết">Truyện, tiểu thuyết</Option>
              <Option value="Tâm lý, tâm linh, tôn giáo">
                Tâm lý, tâm linh, tôn giáo
              </Option>
              <Option value="Sách thiếu nhi">Sách thiếu nhi</Option>
            </Select>
          </div>
          <div className="flex mb-[20px]">
            <label className="w-[100px]">Decription</label>
            <TextArea
              showCount
              maxLength={100}
              style={{ height: 120, width: 320 }}
              onChange={e => setDecription(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div>
        <Button onClick={handleAddBook}>Add Book</Button>
      </div>
    </div>
  )
}

export default AddBook
