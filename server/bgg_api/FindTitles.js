const { parseString } = require("xml2js");

const getTextList = (textData) => {
  const textList = [];
  textData.forEach((line) => {
    let text = line.text;
    text = text.replaceAll("'", "");
    text = text.replaceAll('"', "");
    textList.push(text);
  });
  return textList;
};

const makePotentialTitles = (title, textList, potentialTitles, N) => {
  if (N == 1) {
    potentialTitles.push(title);
    textList = textList.slice(1);
  }

  if (textList.length != 0 && N < 5) {
    let textList2 = [...textList];

    const potentialTitle = title + "%20" + textList[0];
    potentialTitles.push(potentialTitle);
    makePotentialTitles(
      potentialTitle,
      textList.slice(1),
      potentialTitles,
      N + 1
    );

    const potentialTitle2 = textList[0] + "%20" + title;
    potentialTitles.push(potentialTitle2);
    makePotentialTitles(
      potentialTitle2,
      textList2.slice(1),
      potentialTitles,
      N + 1
    );
  }
};

async function checkTitles(potentialTitles) {
  const responses = await Promise.all(
    potentialTitles.map(async (title) => {
      const res = await fetch(
        `https://boardgamegeek.com/xmlapi2/search?query=${title}&type=boardgame`
      );
      const data = await res.text();
      return new Promise((resolve, reject) => {
        try {
          parseString(data, (err, Eresult) => {
            if (err) {
              reject(err);
            } else {
              const resultCount = parseInt(Eresult["items"]["$"]["total"][0]);
              resolve(resultCount > 0 ? title : "none");
            }
          });
        } catch (error) {
          resolve("none")
        }
      });
    })
  );

  return responses;
}

async function findTitles(sortedTextData) {
  const finalTitlesList = [];
  for await (const textData of sortedTextData) {
    if (textData.length == 0) {
      continue;
    }
    let textList = getTextList(textData);
    let title = textList[0];

    const potentialTitles = [];
    makePotentialTitles(title, textList, potentialTitles, 1);
    potentialTitles.sort((a, b) => a.length - b.length);

    const titleResults = await checkTitles(potentialTitles);

    const trimmedResults = titleResults.filter(
      (titleResult) => titleResult != "none"
    );
    if (trimmedResults.length > 0) {
      const finalTitles = trimmedResults[trimmedResults.length - 1];
      finalTitlesList.push(finalTitles);
    }
  }
  return finalTitlesList;
}

module.exports = findTitles;
