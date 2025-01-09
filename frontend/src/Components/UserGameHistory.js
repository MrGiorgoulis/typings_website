import React, { useContext, useEffect, useState } from 'react'
import { UserUuidContext } from '../App';
import axios from 'axios';

function UserGameHistory() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0)
  const user_uuid = useContext(UserUuidContext);
  const [hasMore, setHasMore] = useState(true); 
  const limit = 6;
  

  
  useEffect(() => {fetchGameHistory()}, [page]);

  const fetchGameHistory = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://192.168.49.2:30081/user_history', {
        params: {
          user_uuid: user_uuid,
          limit: limit,
          page: page,
        },
      });

      setGames(response.data);

      if (response.data.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      setError('Failed to load game history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const previous_page = async () => {
    if (page > 0) {
      setPage((prevPage) => prevPage -1)
    }
  }

  const next_page = async () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  if (isLoading) {
    return <div className="loader">Loading game history...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }
  

  return (
    <section className="user-stats-container">
     <div className="table-container">
      <h2>game history</h2>
      <table className="game-history-table">
        <thead>
          <tr>
            <th>game #</th>
            <th>wpm</th>
            <th>time(s)</th>
            <th>timestamp</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => (
            <tr key={index}>
              <td>{game.game_number}</td>
              <td>{(game.wpm).toFixed(2)}</td>
              <td>{game.time}</td>
              <td>{new Date(game.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='game-history-controls'>
        <button className='previous-page-button' onClick={previous_page}  disabled={page === 0}>&lt;</button>
        <button className='next-page-button' onClick={next_page} disabled={!hasMore}>&gt;</button>
      </div>
    </div>
    </section>
  );
}

export default UserGameHistory;
