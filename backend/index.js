const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')

const mongoose = require('mongoose')
const port = process.env.PORT || 5000
require('dotenv').config()

// middleware
app.use(express.json())
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://book-store-and-dashboard-app-zoe8.vercel.app',
    ],
    credentials: true,
  })
)

// routes
const bookRoutes = require('./src/books/book.route')
const orderRoutes = require('./src/orders/order.route')
const userRoutes = require('./src/users/user.route')
const adminRoutes = require('./src/stats/admin.stats')

app.use('/api/books', bookRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth', userRoutes)
app.use('/api/admin', adminRoutes)

async function main() {
  await mongoose.connect(process.env.DB_URL)
  app.use('/', (req, res) => {
    res.send('Book Store Server is running!')
  })
}

main()
  .then(() => console.log('Mongodb connect successfully!'))
  .catch((err) => console.log(err))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  })
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
