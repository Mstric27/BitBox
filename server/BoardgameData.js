const ocrVision = require("./util_text/OcrVision");
const customVision = require("./util_general/CustomVision");
const compress = require("./util_general/Compress");
const sortTextData = require("./util_text/SortTextData");
const findTitles = require("./bgg_api/FindTitles");
const getData = require("./bgg_api/GetData");
const fs = require("fs");
const path = require("path");

async function findBoardgameData(imageName) {
  const imagePath = path.join(__dirname, "images");

  const compressedImage = await compress(imagePath, imageName);

  // use custom vison on image to find board game locations
  const boardgames = await customVision(compressedImage);
  if (boardgames.length == 0) {
    return boardgames
  }

  // use ocr to find all text in the image
  const unsortedTextData = await ocrVision(compressedImage);
  if (unsortedTextData.length == 0) {
    return unsortedTextData
  }

  // delete the image now that we have extracted all the data
  fs.unlinkSync(compressedImage);

  // match each text to the corresponding board game and sort it by descending text size
  const sortedTextData = sortTextData(boardgames, unsortedTextData);

  // find the most likely search result for each board game
  const titles = await findTitles(sortedTextData);
  if (titles.length == 0) {
    return titles
  }

  const boardgameData = await getData(titles);
  console.log('Successful Search')
  return boardgameData;
}

module.exports = findBoardgameData;
