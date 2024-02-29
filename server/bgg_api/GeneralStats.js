const { parseString } = require("xml2js");

async function generalStats(id) {
  const res = await fetch(
    `https://boardgamegeek.com/xmlapi2/thing?id=${id}&stats=1`
  );

  const data = await res.text();
  let results;
  parseString(data, (err, Eresult) => {
    results = Eresult;
  });
  return results;
}

module.exports = generalStats;
