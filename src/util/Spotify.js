let accessToken;
const clientID ='02e90f8fca6543a8beebe5ca56462a41';
const redirectURI = 'http://localhost:3000/';


const Spotify = {
  getAccessToken() {
    if(accessToken) {
      return accessToken;
    }
    const URLToken = window.location.href.match(/access_token=([^&]*)/);
    const tokenExpiration = window.location.href.match(/expires_in=([^&]*)/);
    if (URLToken && tokenExpiration) {
      accessToken = URLToken[1];
      const expires = Number(tokenExpiration[1]);
      window.setTimeout(()=> accessToken = '', expires * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessURL;
    }
  },

  async search(term){
    accessToken = Spotify.getAccessToken();
    
    let response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}` ,
        {
          headers: {
                      Authorization:`Bearer ${accessToken}`
                   }
        });

    let jsonResponse = await response.json();
    let newTracks= []

    newTracks = jsonResponse.tracks.items.map(track =>(
      {
        id:track.id,
        name:track.name,
        artist:track.artists[0].name,
        album:track.album.name,
        uri:track.uri
      }
    ));
    return newTracks;
  },

  savePlayList(name, trackUris) {
      if (!name || !trackUris || trackUris.length === 0) return;
      const searchURL = 'https://api.spotify.com/v1/me';
      const headers = {
        Authorization: `Bearer ${accessToken}`
      };
      let userID;
      let playlistID;
      fetch(searchURL, {
        headers: headers
      })
      .then(response => response.json())
      .then(jsonResponse => userID = jsonResponse.id)
      .then(() => {
        const createPlaylistUrl = `https://api.spotify.com/v1/users/${userID}/playlists`;
        fetch(createPlaylistUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
              name: name
            })
          })
          .then(response => response.json())
          .then(jsonResponse => playlistID = jsonResponse.id)
          .then(() => {
            const addPlaylistTracksUrl = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;
            fetch(addPlaylistTracksUrl, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify({
                uris: trackUris
              })
            });
          })
      })
  }
}

export default Spotify;