const win = [
  // rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // cols
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonal
  [0, 4, 8],
  [2, 4, 6],
];

const isSuperset = (set, subset) => {
  for (let elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
};

const checkForWinner = (gameState) => {
  if (gameState.length < 5) return null;
  let p0 = gameState
    .filter((item) => item && item.player === 0)
    .map((item) => item.id);
  let px = gameState
    .filter((item) => item && item.player === 1)
    .map((item) => item.id);

  if (p0.length > 0) {
    for (let i = 0; i < win.length; i++) {
      if (isSuperset(new Set(p0), new Set(win[i]))) {
        return "Player O";
      }
    }
  }
  if (px.length > 0) {
    for (let i = 0; i < win.length; i++) {
      if (isSuperset(new Set(px), new Set(win[i]))) {
        return "Player X";
      }
    }
  }
  return null;
};

const Board = () => {
  const [player, setPlayer] = React.useState(1);
  const [gameState, setGameState] = React.useState(Array(9).fill(null));
  const [winner, setWinner] = React.useState(null);
  const [isGameOver, setIsGameOver] = React.useState(false);

  let status = isGameOver
    ? winner
      ? `Winner is ${winner}`
      : "It's a Draw!"
    : `Next Player: Player ${player === 1 ? "X" : "O"}`;

  const takeTurn = (id) => {
    if (!gameState[id] && !isGameOver) {
      setGameState((prevGameState) => {
        const updatedGameState = [...prevGameState];
        updatedGameState[id] = { id: id, player: player };
        return updatedGameState;
      });
      setPlayer((prevPlayer) => (prevPlayer + 1) % 2);
    }
  };

  React.useEffect(() => {
    const winner = checkForWinner(gameState);
    if (winner || gameState.filter((cell) => cell === null).length === 0) {
      setIsGameOver(true);
      setWinner(winner);
    }
  }, [gameState]);

  const resetGame = () => {
    setPlayer(1);
    setGameState(Array(9).fill(null));
    setWinner(null);
    setIsGameOver(false);
  };

  function renderSquare(i) {
    return <Square takeTurn={takeTurn} id={i} player={gameState[i]} />;
  }

  return (
    <div className="game-board">
      <div className="grid-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="grid-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="grid-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <div id="info">
        <h1 id="turn">{status}</h1>
        {isGameOver && (
          <button onClick={resetGame}>Restart Game</button>
        )}
      </div>
    </div>
  );
};

const Square = ({ takeTurn, id, player }) => {
  const mark = ["O", "X", "+"];
  const [filled, setFilled] = React.useState(false);
  const [tik, setTik] = React.useState(2);

  React.useEffect(() => {
    setTik(player ? player.player : 2);
    setFilled(!!player);
  }, [player]);

  return (
    <button
      className={tik === 1 ? "red" : "white"}
      onClick={() => {
        if (!filled && !player) {
          setTik(takeTurn(id));
        }
      }}
      disabled={filled || !!player}
    >
      <h1>{mark[tik]}</h1>
    </button>
  );
};

const Game = () => {
  return (
    <div className="game">
      <Board></Board>
    </div>
  );
};

ReactDOM.render(<Game />, document.getElementById("root"));
