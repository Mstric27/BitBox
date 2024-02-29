const getTextData = require("./TextData");

const sortTextData = (boardgames, unsortedTextData) => {
  const sortedTextList = [];
  boardgames.forEach((boardgame) => {
    let textForBoardGame = [];
    unsortedTextData.forEach((line) => {
      // find the size and location of each text line
      const lineData = getTextData(line);
      if (
        lineData.center[0] > boardgame.leftBorder &&
        lineData.center[0] < boardgame.rightBorder
      ) {
        if (
          lineData.center[1] > boardgame.topBorder &&
          lineData.center[1] < boardgame.bottomBorder
        ) {
          textForBoardGame.push(lineData);
        }
      }
    });

    if (textForBoardGame.length > 0) {
      textForBoardGame.sort((a, b) => b.size - a.size);
      sortedTextList.push(textForBoardGame);
    }
  });
  return sortedTextList;
};

module.exports = sortTextData;
