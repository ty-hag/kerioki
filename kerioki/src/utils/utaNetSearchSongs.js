import getLyrics from './getLyrics';

const rp = require('request-promise');
const $ = require('cheerio');


// testing
// const song = encodeURIComponent('安眠棒');


// use genius api to search for a song
const getSongs = async (searchTerm, resultLimiter) => {
  return new Promise((resolve, reject) => {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
    const utaUrl = `https://www.uta-net.com/search/?Keyword=${searchTerm}&x=33&y=23&Aselect=2&Bselect=3`;
    const url = proxyUrl + utaUrl;

    rp(url)
      .then(async (html) => {
        // #ichiran > div.result_table.last > table > tbody > tr:nth-child(1)
        const scrapedResultsRaw = $('#ichiran div.result_table.last table tbody tr', html);

        // scraped results is not an array, it's an object where each key is a number (cOoL!)
        // need to convert it to an array
        const scrapedResultsArray = Object.values(scrapedResultsRaw);
        //console.log(scrapedResultsArray);

        const results = [];

        // setting a limit for results here, some results take too long to load
        // Also, in testing results there are always 3 additional table rows, so I subtracted 3 from length
        let limitResultsTo = scrapedResultsArray.length > 8 ? 5 : scrapedResultsArray.length - 3;

        
        for (let i = 0; i < limitResultsTo; i++) {

          const result = scrapedResultsArray[i];
          console.log(result);

          const currentSong = {};

          // all of these undefined checks are probably unnecessary, they don't seem to work anyway
          // get the song title
          currentSong.title = typeof result.children[0].children[0].children[0].data !== 'undefined' ? result.children[0].children[0].children[0].data : null;
          // get artist name
          currentSong.artist = typeof result.children[1].children[0].children[0].data !== 'undefined' ? result.children[1].children[0].children[0].data : null;
          // get lyrics path
          const lyricsPath = typeof result.children[0].children[0].attribs.href !== 'undefined' ? result.children[0].children[0].attribs.href : null;
          currentSong.lyricsUrl = lyricsPath ? `https://www.uta-net.com${lyricsPath}` : null;
          currentSong.lyrics = await getLyrics(currentSong.lyricsUrl);
          currentSong.language='japanese';
          // using lyricsPath as song id since it should be a unique identifier
          currentSong.id = lyricsPath;
          console.log(`finished song ${i}`);

          results.push(currentSong);
        }

        console.log(results);
        resolve(results);

      })
      .catch(function (err) {
        console.log('in utaNetSearchSongs catch')
        //handle error
        reject(err);
      });
  })

  //   const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
  //   const utaUrl = `https://www.uta-net.com/search/?Keyword=${searchTerm}&x=33&y=23&Aselect=2&Bselect=3`;
  //   const url = proxyUrl + utaUrl;

  //   rp(url)
  //     .then(function (html) {
  //       // #ichiran > div.result_table.last > table > tbody > tr:nth-child(1)
  //       const scrapedResultsRaw = $('#ichiran div.result_table.last table tbody tr', html);

  //       // scraped results is not an array, it's an object where each key is a number (cOoL!)
  //       // need to convert it to an array
  //       const scrapedResultsArray = Object.values(scrapedResultsRaw);
  //       //console.log(scrapedResultsArray);

  //       const results = [];
  //       console.log(scrapedResultsArray.length);

  //       // In testing results, there are always 3 additional table rows, so I subtracted 3 from length
  //       for (let i = 0; i < scrapedResultsArray.length - 3; i++) {

  //         const result = scrapedResultsArray[i];

  //         const currentSong = {};

  //         // all of these undefined checks are probably unnecessary, they don't seem to work anyway
  //         // get the song title
  //         currentSong.title = typeof result.children[0].children[0].children[0].data !== 'undefined' ? result.children[0].children[0].children[0].data : null;
  //         // get artist name
  //         currentSong.artist = typeof result.children[1].children[0].children[0].data !== 'undefined' ? result.children[1].children[0].children[0].data : null;
  //         // get lyrics path
  //         const lyricsPath = typeof result.children[0].children[0].attribs.href !== 'undefined' ? result.children[0].children[0].attribs.href : null;
  //         currentSong.lyricsUrl = lyricsPath ? `https://www.uta-net.com${lyricsPath}` : null;
  //         currentSong.lyrics = 'TEST';

  //         results.push(currentSong);
  //       }

  //       console.log(results);
  //       resolve(results);

  //     })
  //     .catch(function (err) {
  //       //handle error
  //       console.log(err);
  //     });
  // }



  // const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
  // const utaUrl = `https://www.uta-net.com/search/?Keyword=${searchTerm}&x=33&y=23&Aselect=2&Bselect=3`;
  // const url = proxyUrl + utaUrl;

  // rp(url)
  //   .then(function (html) {
  //     // #ichiran > div.result_table.last > table > tbody > tr:nth-child(1)
  //     const scrapedResultsRaw = $('#ichiran div.result_table.last table tbody tr', html);

  //     // scraped results is not an array, it's an object where each key is a number (cOoL!)
  //     // need to convert it to an array
  //     const scrapedResultsArray = Object.values(scrapedResultsRaw);
  //     //console.log(scrapedResultsArray);

  //     const results = [];
  //     console.log(scrapedResultsArray.length);

  //     // In testing results, there are always 3 additional table rows, so I subtracted 3 from length
  //     for (let i = 0; i < scrapedResultsArray.length - 3; i++) {

  //       const result = scrapedResultsArray[i];

  //       const currentSong = {};

  //       // all of these undefined checks are probably unnecessary, they don't seem to work anyway
  //       // get the song title
  //       currentSong.title = typeof result.children[0].children[0].children[0].data !== 'undefined' ? result.children[0].children[0].children[0].data : null;
  //       // get artist name
  //       currentSong.artist = typeof result.children[1].children[0].children[0].data !== 'undefined' ? result.children[1].children[0].children[0].data : null;
  //       // get lyrics path
  //       const lyricsPath = typeof result.children[0].children[0].attribs.href !== 'undefined' ? result.children[0].children[0].attribs.href : null;
  //       currentSong.lyricsUrl = lyricsPath ? `https://www.uta-net.com${lyricsPath}` : null;
  //       currentSong.lyrics = 'TEST';

  //       results.push(currentSong);
  //     }

  //     console.log(results);
  //     return results;

  //   })
  //   .catch(function (err) {
  //     //handle error
  //     console.log(err);
  //   });
}

export default getSongs;