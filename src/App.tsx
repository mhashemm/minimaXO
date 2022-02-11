import "./App.css";
import { ReactComponent as X } from "./x-solid.svg";
import { ReactComponent as O } from "./o-solid.svg";
import { Game, IState, Mark } from "./game";
import { useState } from "react";
import { Square } from "./Square";

interface IScore {
	x: number;
	o: number;
	draw: number;
}

export const App = () => {
	const [game, setGame] = useState(new Game(3));
	const [state, setState] = useState<IState>(game.state);
	const [score, setScore] = useState<IScore>({ x: 0, o: 0, draw: 0 });
	const newGame = (size: number) => {
		const newgame = new Game(size);
		setGame(newgame);
		setState(newgame.state);
	};
	const updateScore = (winner: Mark) => {
		setScore((prev) => ({
			x: prev.x + (winner === Mark.X ? 1 : 0),
			o: prev.o + (winner === Mark.O ? 1 : 0),
			draw: prev.draw + (winner === Mark.Draw ? 1 : 0),
		}));
	};

	return (
		<div className="main">
			<div className="info">
				<div className="gridsize">
					<span>N &#61;</span>
					<input
						type="number"
						defaultValue="3"
						className="square"
						min="3"
						onChange={(e) => newGame(Math.max(e.target.valueAsNumber, 3))}
					/>
				</div>
				<div className="turn square">
					{state.turn === Mark.X ? (
						<X width="24px" height="24px" fill="#31c4be" />
					) : (
						<O width="24px" height="24px" fill="#f2b237" />
					)}{" "}
					<span>TURN</span>
				</div>
				<button
					className="square"
					onClick={() => {
						if (game.generateMove()) {
							setState(game.state);
							updateScore(game.winner);
						}
					}}
				>
					Move
				</button>
				<button className="square" onClick={() => newGame(game.n)}>
					New Game
				</button>
			</div>
			<div
				className="board"
				style={{
					display: "grid",
					gridTemplateColumns: `repeat(${game.n}, 52px)`,
					gridTemplateRows: `repeat(${game.n}, 52px)`,
					gap: "10px",
				}}
			>
				{state.board.map((s, i) => (
					<Square
						key={i}
						mark={s}
						makeMove={() => {
							if (game.makeMove(i)) {
								setState(game.state);
								updateScore(game.winner);
							}
						}}
					/>
				))}
			</div>
			<div className="score">
				<div className="x square">
					<span>X&#61;</span>
					<span>{score.x}</span>
				</div>
				<div className="o square">
					<span>O&#61;</span>
					<span>{score.o}</span>
				</div>
				<div className="draw square">
					<span>Draw&#61;</span>
					<span>{score.draw}</span>
				</div>
			</div>
		</div>
	);
};
