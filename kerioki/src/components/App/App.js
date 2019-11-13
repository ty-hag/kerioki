/*

TODO
Song queue stuff
O On Song add, song gets added to currentSong if none exists, otherwise add to queue
- Give option to add to front of queue
- Next song button removes current currentSong, replaces it with the song at index 0 in songQueue and removes that song from the queue

Limit search results
- Give option to limit number of search results

Handling a lack of search results
- No results from song search displays message
- No results for video search displays message
- Option to input lyrics manually
- Option to input song URL manually


*/

import React from 'react';
import './App.css';
import geniusSearchSongs from '../../utils/geniusSearchSongs';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import CurrentSong from '../CurrentSong/CurrentSong';
import SongQueue from '../SongQueue/SongQueue';
import utaNetSearchSongs from '../../utils/utaNetSearchSongs';

require('dotenv').config();

class App extends React.Component {
  state = {
    songResults: [],
    videoResults: [],
    songQueue: [],
    currentSong: {}
  }

  onSearchSubmit = async (searchParams) => {
    let newSongSearchResults = [];
    if (searchParams.language === "english") {
      newSongSearchResults = await geniusSearchSongs(searchParams.term, searchParams.resultLimit);
    } else {
      newSongSearchResults = await utaNetSearchSongs(searchParams.term, searchParams.resultLimit);
    }

    this.setState({
      songResults: newSongSearchResults,
      videoResults: []
    });
  }

  handleSongAdd = (songToAdd, toFrontOfQueue) => {
    console.log('toFrontOfQueue');
    console.log(toFrontOfQueue);
    // handle case where there is no current song
    if (Object.entries(this.state.currentSong).length === 0 && this.state.currentSong.constructor === Object) {
      console.log('song being sent to current song')
      this.setState({
        currentSong: songToAdd
      })
    } else {  // handle case where there is a current song
      if (toFrontOfQueue) { // handle song being added to front of queue
        console.log('song being added to front of queue');
        console.log()
        const updatedQueue = [songToAdd].concat(this.state.songQueue);
        console.log(updatedQueue)
        this.setState({
          songQueue: updatedQueue
        });
      } else {
        console.log('song being added to end of queue');
        const updatedQueue = this.state.songQueue.concat(songToAdd);
        console.log(updatedQueue)
        this.setState({
          songQueue: updatedQueue
        });
      }
    }
    console.log(this.state.songQueue);
  }

  finishCurrentSong = () => {

    if (this.state.songQueue.length === 0) {
      console.log('songQueue is 0');
      // If there are no more songs in the queue, return currentSong to default, empty-object state
      this.setState({
        currentSong: {}
      })
    } else if (this.state.songQueue.length === 1) {
      console.log('songQueue is 1');
      // If there is one song in the queue, load that song into currentSong and set queue to empty
      const newCurrentSong = this.state.songQueue[0];
      this.setState({
        currentSong: newCurrentSong,
        songQueue: []
      })
    } else {
      // If there is more than one song in the queue, load the first one and remove it from 
      console.log('songQueue is > 1');
      const newCurrentSong = this.state.songQueue[0];
      const newSongQueue = this.state.songQueue.concat([]);
      newSongQueue.shift()
      this.setState({
        currentSong: newCurrentSong,
        songQueue: newSongQueue
      })
    }
  }

  render() {
    return (
      <div className="App">
        Kerioki
        <SearchBar onSubmit={this.onSearchSubmit} />
        <div className="main-container">
          <div>
            <SearchResults
              results={this.state.songResults}
              onVideoSearch={this.onVideoSearch}
              handleSongAdd={this.handleSongAdd}
              videoResults={this.state.videoResults}
            />
          </div>
          <div>
            <CurrentSong currentSong={this.state.currentSong} finishCurrentSong={this.finishCurrentSong} />
            <SongQueue queuedSongs={this.state.songQueue} />
          </div>
        </div>
      </div >
    )
  }
}

export default App;



// const searchResults = [
//   {
//     artist: 'Queen',
//     title: 'Bohemian Rhapsody',
//     lyrics: `Hey hey it is time for the Boheman Rhapsody
//     oh yeah!`
//   },
//   {
//     artist: 'Parquet Courts',
//     title: 'Total Football',
//     lyrics: `[Verse 1]
//     We are conductors of sound, heat and energy
//     And I bet that you thought you had us figured out from the start
//     We are conduits of clear electricity
//     Now you’re back on the pitch to take the apparatus apart

//     [Pre-Chorus 1]
//     You’re an ancient now
//     You're an ancient now
//     You're an ancient now
//     On your own

//     [Chorus 1]
//     Rebels, teachers
//     Strikers, sweepers
//     Better protected
//     Whenever collected

//     [Verse 2]
//     We are troubled by your soft curiosity
//     But delighted to be anti everything you were taught
//     Are you put off by our footloose fluidity?
//     Have your hurt caucasian feelings left you so distraught?

//     [Pre-Chorus 2]
//     Are you quite done now?
//     Are you quite done now?
//     Are you quite done now?
//     Not at all

//     [Chorus 2]
//     Workers, authors
//     Poets, stoppers
//     Power resembled
//     If we are assembled

//     [Verse 3]
//     Only through those who stay awake can an institution be dismantled
//     It is dishonest, nay, a sin to stand for any anthem that attempts to drown out the roar of oppression

//     [Bridge]
//     Hesse Total Football
//     Twombly Total Football
//     Tzara Total Football
//     Mina Total Football
//     Panthers Total Football
//     KoBrA Total Football
//     Dada Total Football
//     Beatles Total Football

//     [Outro]
//     Swapping parts and roles is not acting but rather emancipation from expectation
//     Collectivism and autonomy are not mutually exclusive
//     Those who find discomfort in your goals of liberation will be issued no apology
//     And fuck Tom Brady!`
//   },
//   {
//     artist: 'IDLES',
//     title: 'GREAT',
//     lyrics: `[Verse 1]
//     (listen to more Jungle)
//     Blighty wants his country back
//     Fifty-inch screen in his cul-de-sac
//     Wombic charm of the Union Jack
//     As he cries at the price of a bacon bap

//     [Pre-Chorus]
//     Islam didn’t eat your hamster
//     Change isn’t a crime
//     So won't you take my hand sir
//     And sing with me in time

//     [Chorus]
//     G R E A T
//     G R E A T

//     [Verse 2]
//     Blighty wants her blue passport
//     Not quite sure what the union’s for
//     Burning bridges and closing doors
//     Not sure what she sees on the seashore

//     [Pre-Chorus]
//     Islam didn’t eat your hamster
//     Change isn’t a crime
//     So won't you take my hand sister
//     And sing with me in time

//     [Chorus]
//     G R E A T
//     G R E A T

//     [Outro]
//     You can have it all, I don’t mind
//     Just get ready to work overtime

//     ‘Cause we’re all in this together`
//   }
// ]