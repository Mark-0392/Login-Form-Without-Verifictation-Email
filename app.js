require('dotenv').config()
require('express-async-errors')
// require express
const express = require('express')
const app = express()

// require DataBase
const connectDB = require('./DB/dbConnection')

// rest of the packages
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const { rateLimit } = require('express-rate-limit')
const { xss } = require('express-xss-sanitizer')
const cors = require('cors')

// require routes
const authRouter = require('./Routes/authRoutes')
const userRouter = require('./Routes/userRoutes')
const taskRouter = require('./Routes/taskRoutes')

// require middlewares
const notFoundmiddleWare = require('./middleware/notFound')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.set('trust proxy', 1)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 mins
  limit: 60, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
})
app.use(limiter)
app.use(helmet())
app.use(cors())
app.use(xss())

// app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.Signed_Cookie))

app.get('/', (req, res) => {
  res.send('Hello there')
})

app.get('/api/v1', (req, res) => {
  // console.log(req.signedCookies)

  res.send('The duplicate route')
})

// Routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/tasks', taskRouter)
// Error middlewares
app.use(notFoundmiddleWare)
app.use(errorHandlerMiddleware)

// Port number
const port = process.env.PORT || 5000

// Function to connect to server DB and port
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () =>
      console.log('the server is listening on port 5000....')
    )
  } catch (error) {
    console.log(error)
  }
}

start()
