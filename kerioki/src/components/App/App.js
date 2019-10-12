import React from 'react';
import './App.css';
import getSearchResults from '../../utils/getSearchResults';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';

require('dotenv').config()

const searchResults = [
  {
    artist: 'Parquet Courts',
    title: 'Total Football',
    lyrics: `[Verse 1]
    We are conductors of sound, heat and energy
    And I bet that you thought you had us figured out from the start
    We are conduits of clear electricity
    Now you’re back on the pitch to take the apparatus apart
    
    [Pre-Chorus 1]
    You’re an ancient now
    You're an ancient now
    You're an ancient now
    On your own
    
    [Chorus 1]
    Rebels, teachers
    Strikers, sweepers
    Better protected
    Whenever collected
    
    [Verse 2]
    We are troubled by your soft curiosity
    But delighted to be anti everything you were taught
    Are you put off by our footloose fluidity?
    Have your hurt caucasian feelings left you so distraught?
    
    [Pre-Chorus 2]
    Are you quite done now?
    Are you quite done now?
    Are you quite done now?
    Not at all
    
    [Chorus 2]
    Workers, authors
    Poets, stoppers
    Power resembled
    If we are assembled
    
    [Verse 3]
    Only through those who stay awake can an institution be dismantled
    It is dishonest, nay, a sin to stand for any anthem that attempts to drown out the roar of oppression
    
    [Bridge]
    Hesse Total Football
    Twombly Total Football
    Tzara Total Football
    Mina Total Football
    Panthers Total Football
    KoBrA Total Football
    Dada Total Football
    Beatles Total Football
    
    [Outro]
    Swapping parts and roles is not acting but rather emancipation from expectation
    Collectivism and autonomy are not mutually exclusive
    Those who find discomfort in your goals of liberation will be issued no apology
    And fuck Tom Brady!`
  },
  {
    artist: 'IDLES',
    title: 'GREAT',
    lyrics: `[Verse 1]
    (listen to more Jungle)
    Blighty wants his country back
    Fifty-inch screen in his cul-de-sac
    Wombic charm of the Union Jack
    As he cries at the price of a bacon bap
    
    [Pre-Chorus]
    Islam didn’t eat your hamster
    Change isn’t a crime
    So won't you take my hand sir
    And sing with me in time
    
    [Chorus]
    G R E A T
    G R E A T
    
    [Verse 2]
    Blighty wants her blue passport
    Not quite sure what the union’s for
    Burning bridges and closing doors
    Not sure what she sees on the seashore
    
    [Pre-Chorus]
    Islam didn’t eat your hamster
    Change isn’t a crime
    So won't you take my hand sister
    And sing with me in time
    
    [Chorus]
    G R E A T
    G R E A T
    
    [Outro]
    You can have it all, I don’t mind
    Just get ready to work overtime
    
    ‘Cause we’re all in this together`
  }
]

class App extends React.Component {
  state = {
    songResults: []
  }

  onSearchSubmit = async (searchTerm) => {
    // Replace with scrape or API results once that is working
    const searchResults = getSearchResults(searchTerm);
    this.setState({ songResults: searchResults });
  }

  render() {
    return (
      <div className="App">
        <div className="main-container">
          Hello!
          <SearchBar onSubmit={this.onSearchSubmit} />
          <SearchResults results={this.state.songResults} />
        </div>
      </div >
    )
  }
}

export default App;
