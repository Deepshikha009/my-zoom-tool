const Transcription = require('../models/ranscription');

// Create a new transcription
exports.createTranscription = async (req, res) => {
  const { text, recordingId } = req.body;

  try {
    // Create a new transcription object
    const transcription = new Transcription({
      text,
      recordingId
    });

    // Save the transcription to the database
    await transcription.save();

    // Send the saved transcription object as response
    res.status(201).json(transcription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create transcription' });
  }
};

// Get all transcriptions for a recording
exports.getAllTranscriptions = async (req, res) => {
  const { recordingId } = req.params;

  try {
    // Find all transcriptions for the given recording ID
    const transcriptions = await Transcription.find({ recordingId });

    // Send the array of transcription objects as response
    res.status(200).json(transcriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get transcriptions' });
  }
};

// Delete a transcription
exports.deleteTranscription = async (req, res) => {
  const { transcriptionId } = req.params;

  try {
    // Find the transcription by ID and remove it
    const deletedTranscription = await Transcription.findByIdAndRemove(transcriptionId);

    // If no transcription was found, send an error response
    if (!deletedTranscription) {
      return res.status(404).json({ message: 'Transcription not found' });
    }

    // Send a success response
    res.status(200).json({ message: 'Transcription deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete transcription' });
  }
};
