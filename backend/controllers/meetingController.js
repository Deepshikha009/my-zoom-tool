const Meeting = require('../models/Meeting');

exports.createMeeting = async (req, res) => {
  try {
    const { title, start_time, end_time } = req.body;
    const newMeeting = new Meeting({
      title,
      start_time,
      end_time,
      user: req.user._id,
    });
    await newMeeting.save();
    res.status(201).json({ message: 'Meeting created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ user: req.user._id });
    res.status(200).json(meetings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.status(200).json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateMeeting = async (req, res) => {
  try {
    const { title, start_time, end_time } = req.body;
    let meeting = await Meeting.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    meeting.title = title;
    meeting.start_time = start_time;
    meeting.end_time = end_time;
    await meeting.save();
    res.status(200).json({ message: 'Meeting updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    await meeting.remove();
    res.status(200).json({ message: 'Meeting deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
