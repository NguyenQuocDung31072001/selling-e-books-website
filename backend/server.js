const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const app = express()
const authRouter = require('./router/auth.router')
const accountController = require('./router/account.router')
dotenv.config()

app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use('/image_avatar', express.static(path.join(__dirname, '/image')))

mongoose.connect(
  'mongodb+srv://doan1database:doan1database@database.pytcf.mongodb.net/do_an_1',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('connected to mongoose'))

app.use('/v1/selling_e_books/auth', authRouter)
app.use('/v1/selling_e_books/account', accountController)
app.use('/v1/selling_e_books/author', authorRouter)
app.use('/v1/selling_e_books/genre', genreRouter)
app.use('/v1/selling_e_books/book', bookRouter)
app.listen(5000, () => {
  console.log('server start success')
})
