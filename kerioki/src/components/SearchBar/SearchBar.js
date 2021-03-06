import React from 'react';

class SearchBar extends React.Component {
  state = {
    term: '',
    language: 'english',
    resultLimit: 3
  }

  onFormSubmit = e => {
    e.preventDefault();
    console.log(this.state.term);
    this.props.onSubmit(this.state)
  }

  render() {
    // console.log('rendering SearchBar');
    return (
      <div className='searchbar'>
        <div>
          Choose a language:
            <input type="radio" name="language" value="english" onClick={() => { this.setState({ language: 'english' }) }} /> English
            <input type="radio" name="language" value="japanese" onClick={() => { this.setState({ language: 'japanese' }) }} /> Japanese
        </div>
        <form onSubmit={event => this.onFormSubmit(event)}>
          <label>Search for a song:</label>
          <input
            type='text'
            value={this.state.term}
            onChange={(event) => { this.setState({ term: event.target.value }) }}
          />
          <span>Choose number of results. <span className="note">Less results load faster. </span></span>
          <input
            type="number"
            name="quantity"
            value={this.state.resultLimit}
            onChange={event => {
              console.log(event.target.value > 0);
              this.setState({ resultLimit: event.target.value })
            }}>
          </input>
          <button className="button" type="submit">Submit</button>
          <span> {this.props.searchStatusMessage}</span>
        </form>
      </div >
    )
  }
}

export default SearchBar;