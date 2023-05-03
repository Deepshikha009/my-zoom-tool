const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { validationResult } = require('express-validator')
const User = require('../models/User')

exports.register = async (req, res) => {
  // Check for validation errors in the request body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { name, email, password } = req.body

  try {
    // Check if the user already exists
    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ msg: 'User already exists' })
    }

    // Create a new user object and hash the password
    user = new User({
      name,
      email,
      password
    })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    // Save the user object to the database
    await user.save()

    // Create and return a JWT token for the newly registered user
    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err
        res.json({ token })
      }
    )
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}

exports.login = async (req, res) => {
  // Check for validation errors in the request body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  try {
    // Check if the user exists
    let user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' })
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' })
    }

    // Create and return a JWT token for the logged in user
    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err
        res.json({ token })
      }
    )
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}
