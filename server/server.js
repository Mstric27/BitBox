const express = require("express");
const app = express();
const fs = require("fs");
const findBoardgameData = require("./BoardgameData");
const sharp = require("sharp");
const path = require("path");

app.get("/get-game-data/:param1", async (req, res) => {
  const filename = req.params.param1;
  const data = await findBoardgameData(filename);
  res.json(data);
});

// This method will save the binary content of the request as a file.

app.post("/image-upload", async (req, res) => {
  sharp.cache(false);
  const imageName = Date.now() + ".jpg";
  const imagePath = path.join(__dirname, "images", "image" + imageName);
  const imageStream = fs.createWriteStream(imagePath);

  // Pipe the request stream to the image file
  req.pipe(imageStream);

  // Wait for the upload to be complete
  imageStream.on("finish", () => {
    res.send(imageName);
  });
});

app.listen(3000, () => {
  console.log("Working on localhost:3000");
});
