import React from 'react';

class SearchBar extends React.Component {
  state = {
    term: '',
    language: 'english'
  }

  onFormSubmit = e => {
    e.preventDefault();
    console.log(this.state.term);
    this.props.onSubmit(this.state)
  }

  render() {
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
        </form>
      </div>
    )
  }
}

export default SearchBar;