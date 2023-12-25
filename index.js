const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3001;
const cors = require("cors");
app.use(cors());
// Connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://use32:ksr123@cluster0.v8wc3nj.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

// Get all collections
app.get("/collections", async (req, res) => {
  try {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    if (!collections || collections.length === 0) {
      return res.status(404).send("No collections found.");
    }
    const collectionNames = collections.map((col) => col.name);
    res.json(collectionNames);
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).send(error.message);
  }
});

// Get data from a specific collection
app.get("/collections/:collectionName", async (req, res) => {
  try {
    const { collectionName } = req.params;

    // Check if the model already exists
    let DataModel;
    if (mongoose.connection.models[collectionName]) {
      DataModel = mongoose.connection.models[collectionName];
    } else {
      // Dynamically create the model if it doesn't exist
      const collectionSchema = new mongoose.Schema({});
      DataModel = mongoose.model(collectionName, collectionSchema);
    }

    const data = await DataModel.find({});
    res.json(data);
  } catch (error) {
    console.error(
      `Error fetching data from ${req.params.collectionName}:`,
      error
    );
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
