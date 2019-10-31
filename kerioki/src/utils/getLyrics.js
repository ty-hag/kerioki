const rp = require('request-promise');
const $ = require('cheerio');

require('dotenv').config();


const getLyrics = async (url) => {
  return new Promise((resolve, reject) => {

    const urlWithProxy = process.env.REACT_APP_PROXY_URL + url;

    if (url.startsWith('https://www.uta-net')) {
      // scrape uta net
      rp(urlWithProxy)
        .then(function (html) {
          const scraped = $('#kashi_area', html);
          let lyrics = '';
          scraped["0"].children.forEach(line => {
            if (line.type === 'text') {
              lyrics += line.data + '\n';
            }
          })
          resolve(lyrics);
        })
        .catch(function (err) {
          //handle error
          reject(err);
        });
    } else {
      // scrape genius
      rp(urlWithProxy)
        .then(function (html) {
          const lyrics = $('.lyrics p', html).text();
          resolve(lyrics);
        })
        .catch(function (err) {
          //handle error
          reject(err);
        });
    }

  })
}

export default getLyrics;