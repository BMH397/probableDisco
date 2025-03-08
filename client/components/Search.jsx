import React, {
  createContext,
  useContext,
  useActionState,
  useState,
  useEffect
} from 'react';
import axios from 'axios';
// API Search & axios post
function Search() {
  // * Query Hooks * //
  const [artist, setArtist] = useState(''); // artist query
  const [song, setSong] = useState(''); // song query
  const [album, setAlbum] = useState(''); // album query
  const [results, setResults] = useState([]); // API results
  const [loading, setLoading] = useState(false); // loading state
  const [error, setError] = useState(''); // error handling

  // * Save to DB Hoooks * //

  // Query Inputs
  const handleInputChange = e => {
    const { name, value } = e.target;
    if (name === 'artist') setArtist(value);
    if (name === 'song') setSong(value);
    if (name === 'album') setAlbum(value);
  };

  // Query String construction
  const createQueryString = () => {
    let query = '';
    if (artist) query += `artist:'${artist}'`;
    if (song) query += `track:'${song}'`;
    if (album) query += `album:'${album}'`;
    return query;
  };

  // Deezer API call
  const handleSubmit = async e => {
    // prevents function from running on page render
    e.preventDefault();
    // results handling
    setLoading(true);
    //TODO
    setError('');
    setResults([]);

    try {
      // Build the query string with user inputs
      const queryString = createQueryString();
      if (!queryString) {
        setError('enter at least 1 search term');
        return; // prevents API request attempt
      }
      const response = await fetch(
        `https://api.deezer.com/search?q=${queryString}&limit=10`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      setResults(data.data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add song from search results to Songs Collection
  const addSong = () => {
    axios.post('/songs');
  };

  return (
    <div style={{ paddingBottom: '200px' }} className='advanced-search'>
      <h1 style={{ fontFamily: 'creepster' }}> Advanced Search </h1>
      <div className='search-container'>
        <h3>
          Search for tracks by artist, song, or album—use any combination of
          these options!
        </h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='artist'>Artist</label>
            <input
              type='text'
              id='artist'
              name='artist'
              value={artist}
              onChange={handleInputChange}
              placeholder='Search for an artist'
            />
          </div>
          <div>
            <label htmlFor='song'>Song</label>
            <input
              type='text'
              id='song'
              name='song'
              value={song}
              onChange={handleInputChange}
              placeholder='Search for a song'
            />
          </div>
          <div>
            <label htmlFor='album'>Album</label>
            <input
              type='text'
              id='album'
              name='album'
              value={album}
              onChange={handleInputChange}
              placeholder='Search for an album'
            />
          </div>
          <button className='submit-button' type='submit'>
            {' '}
            🔎
          </button>
        </form>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div className='results-container'>
        <ul style={{ listStyleType: 'none' }}>
          {results.map((result, index) => (
            <li key={index}>
              <strong>{result.title}</strong> by {result.artist.name} from (
              {result.album.title})
              {/*// TODO : buttons and relationship with server side requests and database collections (songs, library, and queue) */}
              <button>add to songs</button>
              <button>play now</button> {/** queue */}
            </li>
          ))}
        </ul>
        <div className='result'></div>
      </div>
    </div>
  );
}
export default Search;
