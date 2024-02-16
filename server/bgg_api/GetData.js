const { parseString } = require("xml2js");
const puppeteer = require("puppeteer");

async function getIds(titles) {
  const browser = await puppeteer.launch({ headless: true });

  const boardgameIdList = await Promise.all(
    titles.map(async (title) => {
      const page = await browser.newPage();
      await page.goto(
        `https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q=${title}`,
        { waitUntil: "networkidle0" }
      );
      const boardgameId = await page.evaluate(() => {
        const boardgameResult = document.querySelector("#results_objectname1");
        const boardgameUrl = boardgameResult
          .querySelector(".primary")
          .getAttribute("href");
        const endpoints = boardgameUrl.split("/");
        return endpoints[2];
      });

      return boardgameId;
    })
  );

  await browser.close();
  return boardgameIdList;
}

async function getData(titles) {
  const boardgameIdList = await getIds(titles);

  const responses = await Promise.all(
    boardgameIdList.map(async (id) => {
      const res = await fetch(
        `https://boardgamegeek.com/xmlapi2/thing?id=${id}&stats=1`
      );
      const data = await res.text();
      return new Promise((resolve, reject) => {
        parseString(data, (err, Eresult) => {
          if (err) {
            reject(err);
          } else {
            resolve(Eresult.items.item[0]);
          }
        });
      });
    })
  );

  return responses;
}

module.exports = getData;
