const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const { MongoClient } = require("mongodb");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Multer for handling multipart/form-data (file uploads)
const upload = multer({ dest: "uploads/" });

// MongoDB Connection URI
const mongoURI = "mongodb://localhost:27017";
const dbName = "LostandFound"; // Database name
const collectionName = "LostFound"; // Collection name
const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect to MongoDB
client.connect((err) => {
  if (err) {
    console.error("Failed to connect to MongoDB:", err);
    return;
  }
  console.log("Connected to MongoDB");
});

// Endpoint for submitting found item
app.post("/submitFound", upload.single("audioFile"), async (req, res) => {
  const db = client.db(dbName);
  const foundItemsCollection = db.collection("foundItems");

  const itemName = req.body.itemName;
  const location = req.body.location;
  const description = req.body.description;
  const audioFile = req.file;

  // Construct the document to be inserted
  const foundItem = {
    itemName,
    location,
    description,
    audioFile: audioFile ? audioFile.filename : null,
  };

  try {
    // Insert the found item document into the collection
    await foundItemsCollection.insertOne(foundItem);
    res.send("Found item submitted successfully");
  } catch (error) {
    console.error("Error inserting found item:", error);
    res.status(500).send("Internal server error");
  }
});

// Endpoint for reporting lost item
app.post("/reportLost", upload.single("audioFile"), async (req, res) => {
  const db = client.db();
  const lostItemsCollection = db.collection(collectionName);

  const itemName = req.body.itemName;
  const location = req.body.location;
  const description = req.body.description;
  const audioFile = req.file;

  // Construct the document to be inserted
  const lostItem = {
    itemName,
    location,
    description,
    audioFile: audioFile ? audioFile.filename : null,
  };

  try {
    // Insert the lost item document into the collection
    await lostItemsCollection.insertOne(lostItem);
    res.send("Lost item reported successfully");
  } catch (error) {
    console.error("Error reporting lost item:", error);
    res.status(500).send("Internal server error");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
