const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path') // <-- Needed for serving static files
require('dotenv').config()

const port = process.env.PORT || 5000

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

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const __dirnamePath = path.resolve() // handle __dirname
  app.use(express.static(path.join(__dirnamePath, 'frontend', 'dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirnamePath, 'frontend', 'dist', 'index.html'))
  })
}

// Connect DB and start server
async function main() {
  await mongoose.connect(process.env.DB_URL)
  console.log('MongoDB connected successfully!')
}

main().catch((err) => console.log(err))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
