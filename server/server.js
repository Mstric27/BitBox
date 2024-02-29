const express = require("express");
const app = express();
const fs = require("fs");
const findBoardgameData = require("./BoardgameData");
const path = require("path");
const generalSearch = require("./bgg_api/GeneralSearch");
const generalStats = require("./bgg_api/GeneralStats");

app.get("/get-game-data/:param1", async (req, res) => {
  const filename = req.params.param1;
  const data = await findBoardgameData(filename);
  res.json(data);
});

// This method will save the binary content of the request as a file.

app.post("/image-upload/:param1", async (req, res) => {
  const uid = req.params.param1;
  const imageName = uid + Date.now() + ".jpg";
  const imagePath = path.join(__dirname, "images", "image" + imageName);
  const imageStream = fs.createWriteStream(imagePath);

  // Pipe the request stream to the image file
  req.pipe(imageStream);

  // Wait for the upload to be complete
  imageStream.on("finish", () => {
    res.send(imageName);
  });
});

// This will search the BGG API and return the results

app.get("/general-search/:param1", async (req, res) => {
  const searchQuery = req.params.param1;
  const results = await generalSearch(searchQuery)
  res.json(results);
});

// This will search the BGG API and return the stats of a specifc board game

app.get("/general-stats/:param1", async (req, res) => {
  const id = req.params.param1;
  const results = await generalStats(id)
  res.json(results);
});

app.listen(3000, () => {
  console.log("Working on localhost:3000");
});
