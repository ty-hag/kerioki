const rp = require('request-promise');
const $ = require('cheerio');
//const fetch = require('node-fetch');

// config
require('dotenv').config();
const geniusApiKey = process.env.REACT_APP_GENIUS_API_KEY;
console.log("geniusApiKey process.env");
console.log(process.env);
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

const getGeniusLyrics = (url) => {
  // TODO scrape URL for lyrics
  // TODO make this return promise
  return 'HEY HEY whats goin on yall';
}

// use genius api to search for a song
const getSearchResults = async (searchTerm) => {
  return new Promise(async (resolve, reject) => {

    const song = encodeURIComponent(searchTerm);
    const geniusUrl = `${proxyUrl}https://api.genius.com/search?q=${song}`

    try {
      const response = await fetch(geniusUrl, {
        headers: {
          Authorization: geniusApiKey
        }
      })
      const responseJson = await response.json();
      console.log("responseJson");
      console.log(responseJson);

      // get array of search results from response
      const searchResultsArray = responseJson.response.hits;

      // Return a single result
      // TODO: Return 10 results
      const result = [];

      for (let i = 0; i < searchResultsArray.length; i++) {
        const songInfo = {};
        songInfo.artist = searchResultsArray[i].result.primary_artist.name;
        songInfo.title = searchResultsArray[i].result.title_with_featured;
        // going to leave lyrics as an empty string, they can be scraped later via separate component
        songInfo.lyrics = '';
        songInfo.lyricsUrl = searchResultsArray[i].result.url;
        result.push(songInfo);
      }

      resolve(result);

    } catch (error) {
      console.log(error);
    }
  })
}

export default getSearchResults;