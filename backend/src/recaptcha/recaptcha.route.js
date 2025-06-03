import express from 'express'
import fetch from 'node-fetch' // or use axios
import dotenv from 'dotenv'

dotenv.config()
const router = express.Router()

router.post('/verify-recaptcha', async (req, res) => {
  const { token } = req.body

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token missing' })
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${token}`,
      }
    )

    const data = await response.json()

    if (data.success) {
      res.status(200).json({ success: true })
    } else {
      res.status(400).json({ success: false, errors: data['error-codes'] })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error })
  }
})

export default router
