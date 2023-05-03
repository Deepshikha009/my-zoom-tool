const express = require('express')
const router = express.Router()
const auth = require('../middleware/authenticate')
const Meeting = require('../models/Meeting')


router.post('/', auth, async (req, res) => {
  try {
    // Create a new Meeting object using the request body data
    const meeting = new Meeting({
      topic: req.body.topic,
      start_time: req.body.start_time,
      duration: req.body.duration,
      agenda: req.body.agenda,
      password: req.body.password,
      host_id: req.user.id,
      host_name: req.user.name,
      timezone: req.body.timezone
    })

    // Save the meeting object to the database
    const newMeeting = await meeting.save()

    // Return the newly created meeting object as the response
    res.json(newMeeting)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})


router.get('/:id', auth, async (req, res) => {
  try {
    // Find the meeting in the database using the provided ID
    const meeting = await Meeting.findById(req.params.id)

    // If the meeting is not found, return a 404 error
    if (!meeting) {
      return res.status(404).json({ msg: 'Meeting not found' })
    }

    // Check if the current user is the host of the meeting
    if (meeting.host_id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }

    // Return the meeting object as the response
    res.json(meeting)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Meeting not found' })
    }
    res.status(500).send('Server Error')
  }
})

module.exports = router
