const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const paypal = require('paypal-rest-sdk')

const app = express()

//import router
const authRouter = require('./router/auth.router')
const accountController = require('./router/account.router')
const authorRouter = require('./router/author.router')
const genreRouter = require('./router/genre.router')
const bookRouter = require('./router/book.router')
const reviewRouter = require('./router/review.router')
const collectionRouter = require('./router/collection.router')
const orderRouter = require('./router/order.router')

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

//Paypal configuration
paypal.configure({
  mode: 'sandbox', //sandbox or live
  client_id:
    'AcUD-OTEl1jI3EXjRfUNe5olTXuTGO5jUoTXmGN6XJmMvGpFerVUyTG--CDA4muZcwfZCngghMaL2gzb',
  client_secret:
    'EEybBz7wFWwcplQCtLqJOV-3hzYsXJgxqDbx8H1ZcXgd6kNoofkkE20f3F8URfdYpzzaA_1Ko5LoO6sG'
})

app.use('/v1/selling_e_books/auth', authRouter)
app.use('/v1/selling_e_books/account', accountController)
app.use('/v1/selling_e_books/author', authorRouter)
app.use('/v1/selling_e_books/genre', genreRouter)
app.use('/v1/selling_e_books/book', bookRouter)
app.use('/v1/selling_e_books/review', reviewRouter)
app.use('/v1/selling_e_books/collection', collectionRouter)
app.use('/v1/selling_e_books/order', orderRouter)
app.listen(5000, () => {
  console.log('server start success')
})
