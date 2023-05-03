const express = require('express')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const Call = require('../models/Call')

const router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })

router.get('/', async (req, res) => {
  try {
    const token = req.cookies.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const calls = await Call.find({ userId: decoded.userId }).sort({ createdAt: 'desc' })
    res.json(calls)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const token = req.cookies.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { topic, duration } = req.body
    const call = new Call({
      userId: decoded.userId,
      topic,
      duration,
      recording: req.file.path
    })
    await call.save()
    res.json({ message: 'Call created' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const call = await Call.findById(req.params.id)
    if (!call) {
      return res.status(404).json({ message: 'Call not found' })
    }
    const token = req.cookies.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.userId !== call.userId.toString()) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    res.json(call)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
