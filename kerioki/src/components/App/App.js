/*

TODO

BUG: Lyrics index does not reset when next queued song is loaded

This is all fixed by resetting the search results on queue add, but I don't fully understand how it was broken :(
  BUG: video search results disappear when clicked
  ("fixed" this by clearing search results when video is added to queue, but would still like to know why it did this)
    - It is being re-rendered with the default state setting on SearchResultSong
    - How do I prevent this from rendering on click? Why does this happen in the first place?
      T - I'm guessing it's because SearchResults are getting re-rendered. Why is that? Its state is not changing.
      C - Check to make sure handleSongAdd doesn't somehow change state passed to SearchResultSong
    ? - What is actually happening? Why don't lyrics get erased too?
      A - Lyrics come from App.js' state (specifically objects in searchResults). The lyrics are getting re-rendered with the same values since those values come from props (they are never instantiated as empties like the video results).
      A - When a song is queued, searchResults's render is called twice. The first time the current props and nextProps match, so it doesn't render. For some reason, it is called again, and when that happens the nextProps are "undefined". As a result the props don't match and everything gets rendered.
      ? - Does something in App.js call setState again after the queueing function?
        A - Doesn't look that way
      ? - What triggers the second render and why are the props undefined?
        - Look into chrome debugger
        - (Wrote this and decided I need to double-check)Not sure that it's a second render, but that the child components are just rendering even if the parents are not. It is rendering the video search results again  with an empty string?
        - Going to let this slide for now since it's not broken, it's just not my preferred functionality
  BUG: If you queue a video, then queue a different video from the same song search it appears to add the video to currentSong and queue the same one
  (this is also "fixed" by clearing the search results, still don't know why it did it)
  - currentSong is being updated with video, it should recognize that there is a video in the queue already?

Replaced with static buttons
  BUG: Fix hover buttons for queueing songs
  G - Remove hover modal
  G - Add buttons
  G - Switch event listeners to buttons
  - Actually fix the hover modal cuz it's cooler

Handling a lack of search results
G - No results from song search displays message
- No results for video search displays message

FEATURES:
Lyrics scrolling (cycle through lines with up/down arrows, current line displays big, previous line and next 3 lines display small)
  G - Lyrics must be processed into an array of strings, each string being a new line
    G - Console.log the chopped lyrics to confirm it's working
  G - Highlighted line determined by an index, which is a state on currentSongLyrics?
    G - create index state on currentSongLyrics
    G - Have lyrics display based on state (slice array and map over new array for display)
  - Index resets to 0 when a new song loads
  - Prevent scrolling into negative index

Controller as remote scroller
  - Check for valid controller

Ability to copy+paste lyrics

Ability to copy+paste youtube link
UI error message on invalid youtube link input


*/

import React from 'react';
import './App.css';
import geniusSearchSongs from '../../utils/geniusSearchSongs';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import CurrentSong from '../CurrentSong/CurrentSong';
import SongQueue from '../SongQueue/SongQueue';
import utaNetSearchSongs from '../../utils/utaNetSearchSongs';
import { thisExpression } from '@babel/types';

require('dotenv').config();

class App extends React.Component {
  state = {
    songResults: [],
    searchStatusMessage: 'default',
    songQueue: [],
    currentSong: {},
    controllerConnectedIndex: -1
  }

  componentDidMount = () => {
    console.log('componentDidMount on App.js');
    window.addEventListener("gamepadconnected", function (e) {
      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length);
    });
    console.log(navigator.getGamepads());
    this.checkForController();
  }

  onSearchSubmit = async (searchParams) => {
    // Handle initial search for songs/lyrics
    this.setState({
      searchStatusMessage: 'Searching...'
    });

    let newSongSearchResults = [];
    let updatedSearchStatusMessage = '';
    if (searchParams.language === "english") {
      newSongSearchResults = await geniusSearchSongs(searchParams.term, searchParams.resultLimit);
    } else {
      try {
        newSongSearchResults = await utaNetSearchSongs(searchParams.term, searchParams.resultLimit);
      } catch (error) {
        console.log('utanet search failed');
        updatedSearchStatusMessage = `Your search was bad`;
      }
    }

    // testing for failed search at genius
    console.log("newSongSearchResults")
    console.log(newSongSearchResults)

    this.setState({
      searchStatusMessage: updatedSearchStatusMessage,
      songResults: newSongSearchResults,
    });
  }

  handleSongAdd = (songToAdd, toFrontOfQueue) => {
    // handle case where there is no current song
    if (Object.entries(this.state.currentSong).length === 0 && this.state.currentSong.constructor === Object) {
      console.log('adding to current song')
      this.setState({
        currentSong: songToAdd,
        songResults: []
      })
    } else {  // handle case where there is a current song
      if (toFrontOfQueue) { // handle song being added to front of queue
        console.log('adding to front of queue');
        const updatedQueue = [songToAdd].concat(this.state.songQueue);
        this.setState({
          songQueue: updatedQueue,
          songResults: []
        });
      } else {
        console.log('adding to end of queue');
        const updatedQueue = this.state.songQueue.concat(songToAdd);
        this.setState({
          songQueue: updatedQueue,
          songResults: []
        });
      }
    }
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

  checkForController = () => {
    console.log('checking for controller');
    // Can't check for null as something that is null returns "object" on typeof
    // Does !theObjectToCheck work in its place? Looking at:
    // https://stackoverflow.com/questions/6003884/how-do-i-check-for-null-values-in-javascript
    if (!navigator.getGamepads()[0]) {
      console.log('gamepad null i guess');
    } else {
      if (navigator.getGamepads()[0].id === "Xbox 360 Controller (XInput STANDARD GAMEPAD)") {
        console.log('xbox controller at index 0');
        this.setState({controllerConnectedIndex: 0})
      } else if (navigator.getGamepads()[1].id === "Xbox 360 Controller (XInput STANDARD GAMEPAD)"){
        console.log('xbox controller at index 1');
        this.setState({controllerConnectedIndex: 1})
      }
    }
  }

  render() {
    return (
      <div className="App">
        <div className="title-bar">
          <div>Kerioki</div>
          <div>
            <span onClick={this.checkForController}>Check for controller</span>
            <span className={this.state.controllerConnectedIndex === 0 || this.state.controllerConnectedIndex === 1 ? 'controller-found' : 'controller-missing'}>Controller</span>
          </div>
        </div>
        <SearchBar onSubmit={this.onSearchSubmit} searchStatusMessage={this.state.searchStatusMessage} />
        <div className="main-container">
          <div>
            <SearchResults
              results={this.state.songResults}
              onVideoSearch={this.onVideoSearch}
              handleSongAdd={this.handleSongAdd}
            />
          </div>
          <div>
            <SongQueue queuedSongs={this.state.songQueue} />
            <CurrentSong currentSong={this.state.currentSong} finishCurrentSong={this.finishCurrentSong} controllerConnectedIndex={this.state.controllerConnectedIndex} />
          </div>
        </div>
      </div >
    )
  }
}

export default App;