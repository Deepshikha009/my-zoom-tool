const Meeting = require("../models/Meeting");

const authorize = (role) => async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    if (meeting.user.toString() !== userId && role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = authorize;
