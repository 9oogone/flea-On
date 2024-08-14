const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendNotification = onRequest(async (req, res) => {
  const {token, title, body, icon} = req.body;

  const message = {
    notification: {
      title,
      body,
      icon,
    },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).send(`Notification sent successfully: ${response}`);
  } catch (error) {
    logger.error("Error sending notification:", error);
    res.status(500).send(`Error sending notification: ${error}`);
  }
});
