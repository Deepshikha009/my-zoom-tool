const mongoose = require('mongoose')

const transcriptionSchema = new mongoose.Schema({
  recording: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recording',
    required: true,
  },
  transcript: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Transcription', transcriptionSchema)
