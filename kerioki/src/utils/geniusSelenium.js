const { Builder } = require('selenium-webdriver');
const cheerio = require('cheerio');

// const searchTerm = 'u2';

async function getSearchResults(searchTerm) {

  const encodedSearch = encodeURIComponent(searchTerm);
  const searchUrl = `https://genius.com/search?q=${encodedSearch}`;

  let driver = await new Builder().forBrowser('chrome').build();
  
  try {
    await driver.get(searchUrl);
    const renderedHtml = await driver.executeScript("return document.body.innerHTML");
    // const rawResults = $('search-result-item div mini-song-card a', renderedHtml);
    const htmlCheerioObject = cheerio.load(renderedHtml);

    // Links
    // This is in object form where each key is an integer (shitty array?)
    const linkElements = htmlCheerioObject('search-result-item div mini-song-card a');
    const rawLinksArray = Object.values(linkElements);

    // Song titles
    // body > routable-page > ng-outlet > search-results-page > div > div.column_layout > div.column_layout-column_span.column_layout-column_span--primary > div:nth-child(2) > search-result-section > div > div:nth-child(2) > search-result-items > div:nth-child(1) > search-result-item > div > mini-song-card > a > div.mini_card-info > div.mini_card-title_and_subtitle > div.mini_card-title
    const songElements = htmlCheerioObject('search-result-item div mini-song-card a div.mini_card-info div.mini_card-title_and_subtitle div.mini_card-title');
    const rawSongsArray = Object.values(songElements);

    // Artists
    // body > routable-page > ng-outlet > search-results-page > div > div.column_layout > div.column_layout-column_span.column_layout-column_span--primary > div:nth-child(2) > search-result-section > div > div:nth-child(2) > search-result-items > div:nth-child(1) > search-result-item > div > mini-song-card > a > div.mini_card-info > div.mini_card-title_and_subtitle > div.mini_card-subtitle
    const artistElements = htmlCheerioObject('search-result-item div mini-song-card a div.mini_card-info div.mini_card-title_and_subtitle div.mini_card-subtitle');
    const rawArtistsArray = Object.values(artistElements);

    // array to return
    const resultsToReturn = [];

    // I did the minus 4 here because the length of the array always had 4 more entries than there were links
    for (let i = 0; i < rawLinksArray.length - 4; i++) {

      // new object for each result
      const result = {};
      result.link = rawLinksArray[i].attribs.href;
      result.song = rawSongsArray[i].children[0].data;
      result.artist = rawArtistsArray[i].children[0].data.trim();
      resultsToReturn.push(result);
    }

    console.log(resultsToReturn);

  } catch (err) {
    console.log(err);
  } finally {
    await driver.quit();
  }
}

export default getSearchResults;