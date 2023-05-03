const Recording = require('../models/recording.js');

// Create a new recording
exports.createRecording = async (req, res) => {
  const { url, duration, meetingId } = req.body;

  try {
    // Create a new recording object
    const recording = new Recording({
      url,
      duration,
      meetingId
    });

    // Save the recording to the database
    await recording.save();

    // Send the saved recording object as response
    res.status(201).json(recording);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create recording' });
  }
};

// Get all recordings for a meeting
exports.getAllRecordings = async (req, res) => {
  const { meetingId } = req.params;

  try {
    // Find all recordings for the given meeting ID
    const recordings = await Recording.find({ meetingId });

    // Send the array of recording objects as response
    res.status(200).json(recordings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get recordings' });
  }
};

// Delete a recording
exports.deleteRecording = async (req, res) => {
  const { recordingId } = req.params;

  try {
    // Find the recording by ID and remove it
    const deletedRecording = await Recording.findByIdAndRemove(recordingId);

    // If no recording was found, send an error response
    if (!deletedRecording) {
      return res.status(404).json({ message: 'Recording not found' });
    }

    // Send a success response
    res.status(200).json({ message: 'Recording deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete recording' });
  }
};
