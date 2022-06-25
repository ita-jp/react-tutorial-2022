import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const BOARD_SIZE = 3

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
      {Array(BOARD_SIZE).fill(1).map((_, row) => {
      return (
        <div key={row} className="board-row">
          {Array(BOARD_SIZE).fill(1).map((_, col) => {
            return this.renderSquare(BOARD_SIZE * row + col)
        })}
      </div>)
    })}
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {squares: Array(9).fill(null), changedAt: null}
      ],
      stepNumber: 0,
      xIsNext: true,
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{ squares, changedAt: i }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(nth) {
    this.setState({
      stepNumber: nth,
      xIsNext: (nth % 2) === 0
    })
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const histories = history.map((snapshot, nth) => {
      const col = snapshot.changedAt % BOARD_SIZE
      const row = Math.floor(snapshot.changedAt / BOARD_SIZE)
      const desc = nth === 0 ? 'Go to game start' : `Go to move #${nth}: (${col}, ${row})`;
      return (
        <li key={nth}>
          <button onClick={() => this.jumpTo(nth)} style={{fontWeight:nth === this.state.stepNumber ? 'bold' : 'normal'}}>{desc}</button>
        </li>
      )
    })
    let status;
    if (winner) {
      status = `Winner: ${winner}`
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{histories}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
