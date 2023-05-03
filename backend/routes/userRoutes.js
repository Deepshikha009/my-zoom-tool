const express = require('express')
const router = express.Router()
const auth = require('../middleware/authenticate')
const User = require('../models/User')

router.get('/me', auth, async (req, res) => {
  try {
    // Get the user ID from the auth middleware
    const userId = req.user.id

    // Find the user in the database and exclude the password field
    const user = await User.findById(userId).select('-password')

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    // Return the user object
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})


router.put('/me', auth, async (req, res) => {
  try {
    // Get the user ID from the auth middleware
    const userId = req.user.id

    // Find the user in the database
    let user = await User.findById(userId)

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    // Update the user object with the new data
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.timezone = req.body.timezone || user.timezone

    // Save the updated user object to the database
    user = await user.save()

    // Return the updated user object
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
