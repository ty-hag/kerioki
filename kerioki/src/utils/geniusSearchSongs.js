import getLyrics from './getLyrics';

// config
require('dotenv').config();
const geniusApiKey = process.env.REACT_APP_GENIUS_API_KEY;
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

// use genius api to search for a song
const getSearchResults = async (searchTerm, resultsLimit) => {
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

      // limit results
      let numberSongsToReturn = searchResultsArray.length < resultsLimit ? searchResultsArray.length : resultsLimit;

      for (let i = 0; i < numberSongsToReturn; i++) {
        const songInfo = {};
        songInfo.artist = searchResultsArray[i].result.primary_artist.name;
        songInfo.title = searchResultsArray[i].result.title_with_featured;
        songInfo.lyrics = await getLyrics(searchResultsArray[i].result.url);
        songInfo.lyricsUrl = searchResultsArray[i].result.url;
        songInfo.language = 'english';
        // using url as an ID as it should be a unique identifier
        songInfo.id = searchResultsArray[i].result.url;

        result.push(songInfo);
      }

      resolve(result);

    } catch (error) {
      reject(error);
    }
  })
}

export default getSearchResults;