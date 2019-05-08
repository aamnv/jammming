import React from 'react';
import './App.css';
import Playlist from '../Playlist/Playlist'
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Spotify from '../../util/Spotify'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playListName: 'New Playlist',
      playListTracks: []
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlayListName = this.updatePlayListName.bind(this);
    this.savePlayList = this.savePlayList.bind(this);
    this.search = this.search.bind(this);
  }

  savePlayList() {
    const trackURIs = this.state.playListTracks.map(playListTrack => playListTrack.uri);
    Spotify.savePlayList(this.state.playListName, trackURIs);

    this.setState({searchResults: []});
    this.setState({playListTracks: []});
    this.updatePlayListName('New Playlist');
  }

  addTrack(track) {
    if (this.state.playListTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }

    let tracks = this.state.playListTracks;
    tracks.push(track);
    this.setState({playListTracks: tracks});
  }

  removeTrack(track) {
    let tracks = this.state.playListTracks;
    tracks = tracks.filter(current => current.id !== track.id);
    this.setState({playListTracks: tracks});
  }

  updatePlayListName(name) {
    this.setState({playListName: name});
  }

  search(searchTerm) {
    Spotify.search(searchTerm)
      .then(results => {this.setState({searchResults: results})});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist 
              playListName={this.state.playListName} 
              playListTracks={this.state.playListTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlayListName}
              onSave={this.savePlayList}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
