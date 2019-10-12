import React from 'react';

class SearchBar extends React.Component {
  state = {
    term: ''
  }

  onFormSubmit = e => {
    e.preventDefault();
    console.log(this.state.term);
    this.props.onSubmit(this.state.term)
  }

  render() {
    return (
      <div className='searchbar'>
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