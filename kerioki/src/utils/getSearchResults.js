const rp = require('request-promise');
const $ = require('cheerio');
//const fetch = require('node-fetch');

// config
const geniusApiKey = process.env.GENIUS_API_KEY;

// use genius api to search for a song
const getSearchResults = async (searchTerm) => {

  // test return
  // return {
  //   artist: "Tim Dog",
  //   title: "Fuck Compton",
  //   lyrics: "step to me if you ready for a beat down" 
  // }

  const song = encodeURIComponent(searchTerm);
  const geniusUrl = `https://api.genius.com/search?q=${song}`

  try {
    const response = await fetch(geniusUrl, {
      headers: {
        Authorization: geniusApiKey
      }
    })
    const responseJson = await response.json();

    // Return a single result
    // TODO: Return 10 results
    const result = {};
    result.artist = responseJson.response.hits[0].result.primary_artist;
    result.title = responseJson.response.hits[0].result.title_with_featured;
    const url = responseJson.response.hits[0].result.url;

    rp(url)
      .then(function (html) {
        result.lyrics = $('.lyrics p', html).text();
        return result;
      })
      .catch(function (err) {
        //handle error
        console.log(err);
      });

  } catch (error) {
    console.log(error);
  }
}

export default getSearchResults;