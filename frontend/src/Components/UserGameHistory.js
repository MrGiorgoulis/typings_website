function UserGameHistory() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const response = await axios.get("/api/game-history");
        setGames(response.data);
      } catch (err) {
        setError("Failed to load game history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameHistory();
  }, []);

  if (isLoading) {
    return <div className="loader">Loading game history...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <section className="user-stats-container">
      <div className="game-history">
        <h2>Your Game History</h2>
        {games.length === 0 ? (
          <p>No games found. Play some games to see your history!</p>
        ) : (
          <table className="game-history-table">
            <thead>
              <tr>
                <th>Game Number</th>
                <th>WPM</th>
                <th>Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>game numbers</td>
                <td>game wpm</td>
                <td>game titles</td>
                <td>timestamp</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default UserGameHistory;
