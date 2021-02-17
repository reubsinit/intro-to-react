import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winner = calculateWinner(this.props.squares);

    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={winner && winner.line.includes(i)}
      />
    );
  }
  render() {
    const rows = [];
    let cells = [];
    for (let i = 0; i < 9; i++) {
      cells.push(this.renderSquare(i));
    }
    for (let i = 0; i < 3; i++) {
      rows.push(
        <div className="board-row">
          {cells.slice(i * 3, (i + 1) * 3)}
        </div>
      );
    }
    return (
      <div>
        <div className="status">{status}</div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          playedMovedLocation: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      toggled: false,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(
      0,
      this.state.stepNumber + 1
    );
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        { squares: squares, playedMovedLocation: i },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 == 0,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let desc;
      if (move) {
        const playedMovedLocation = step.playedMovedLocation;
        let row;
        if (playedMovedLocation < 3) row = 1;
        else if (playedMovedLocation > 5) row = 3;
        else row = 2;
        desc = `Go to move #${move} - COL: ${
          (step.playedMovedLocation % 3) + 1
        } ROW: ${row}`;
      } else {
        desc = 'Go to game start';
      }
      if (move == this.state.stepNumber) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              <strong>{desc}</strong>
            </button>
          </li>
        );
      } else {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
    });

    let status;
    if (winner) {
      status = `Winner: ${winner.winner}`;
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
          <div>
            <button
              onClick={() =>
                this.setState({ toggled: !this.state.toggled })
              }
            >
              Toggle moves
            </button>
          </div>
          <ol>{this.state.toggled ? moves.reverse() : moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

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
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}
