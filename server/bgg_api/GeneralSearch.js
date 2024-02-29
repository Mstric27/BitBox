const { parseString } = require("xml2js");

const formatText = (searchQuery) => {
  searchQuery = searchQuery.replaceAll("'", "");
  searchQuery = searchQuery.replaceAll('"', "");
  searchQuery = searchQuery.replaceAll(" ", "%20");

  return searchQuery;
};

async function generalSearch(searchQuery) {
  const query = formatText(searchQuery);

  const res = await fetch(
    `https://boardgamegeek.com/xmlapi2/search?query=${query}&type=boardgame`
  );
  const data = await res.text();
  let results;
  parseString(data, (err, Eresult) => {
    results = Eresult;
  });

  return results;
}

module.exports = generalSearch;
