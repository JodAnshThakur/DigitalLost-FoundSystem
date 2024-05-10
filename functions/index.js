const admin = require("firebase-admin");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

admin.initializeApp();

exports.reportLost = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).send("Method Not Allowed");
  }

  try {
    const { itemName, location, description } = req.body;

    // Add the lost product data to Firestore
    await admin.firestore().collection("lostProducts").add({
      itemName,
      location,
      description,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).send("Lost item reported successfully");
  } catch (error) {
    logger.error("Error reporting lost item:", error);
    return res.status(500).send("Error reporting lost item");
  }
});
