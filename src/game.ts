import { minimax } from "./minimax";

export interface IState {
	board: ReadonlyArray<Mark>;
	turn: Mark;
}

export const enum Mark {
	Empty,
	X,
	O,
	Draw,
}

export type Board = Mark[];

export const getAvailableMoves = (board: Board) => {
	return board.map((s, i) => (s === Mark.Empty ? i : -1)).filter((i) => i !== -1);
};

export const isDraw = (board: Board) => board.every((s) => s !== Mark.Empty);

export const isWinner = (board: Board, n: number, index: number, turn: Mark) => {
	const row = Math.floor(index / n),
		col = index % n;
	const inDiagonal = row === col || row === n - col - 1;
	return (inDiagonal && checkDiagonal(board, n, turn)) || checkRowAndCol(board, n, row, col, turn);
};
export const checkDiagonal = (board: Board, n: number, turn: Mark) => {
	let major = true,
		minor = true;
	for (let i = 0; i < n && (major || minor); i++) {
		major &&= getAt(board, n, i, i) === turn;
		minor &&= getAt(board, n, i, n - 1 - i) === turn;
	}
	return major || minor;
};
export const checkRowAndCol = (board: Board, n: number, row: number, col: number, turn: Mark) => {
	let r = true,
		c = true;
	for (let i = 0; i < n && (r || c); i++) {
		r &&= getAt(board, n, row, i) === turn;
		c &&= getAt(board, n, i, col) === turn;
	}
	return r || c;
};

export const checkAllRowsAndCols = (board: Board, n: number, turn: Mark) => {
	let res = false;
	for (let i = 0; i < n; i++) {
		res ||= checkRowAndCol(board, n, i, i, turn);
	}
	return res;
};

export const getAt = (board: Board, n: number, row: number, col: number) => board[row * n + col];

export class Game {
	readonly #board: Board;
	readonly #n: number;
	#turn: Mark;
	#winner: Mark;
	#squaresLeft: number;

	constructor(n: number) {
		this.#n = n;
		this.#board = new Array(n * n).fill(Mark.Empty);
		this.#turn = Mark.X;
		this.#winner = Mark.Empty;
		this.#squaresLeft = n * n;
	}

	public get board() {
		return [...this.#board];
	}
	public get n() {
		return this.#n;
	}
	public get turn() {
		return this.#turn;
	}
	public get winner() {
		return this.#winner;
	}

	public get state(): IState {
		return { board: this.board as ReadonlyArray<Mark>, turn: this.#turn };
	}

	public toggleTurn() {
		this.#turn = this.#turn === Mark.X ? Mark.O : Mark.X;
	}

	public makeMove(index: number): boolean {
		if (this.#board[index] !== Mark.Empty || this.#winner !== Mark.Empty || this.#squaresLeft === 0) return false;
		this.#board[index] = this.#turn;
		this.#winner = isWinner(this.#board, this.#n, index, this.#turn)
			? this.#turn
			: this.#squaresLeft - 1 === 0
			? Mark.Draw
			: Mark.Empty;
		this.#squaresLeft--;
		this.toggleTurn();
		return true;
	}

	public generateMove() {
		if (this.#squaresLeft === this.#n * this.#n) {
			const moves = getAvailableMoves(this.#board);
			return this.makeMove(moves[Math.floor(Math.random() * moves.length)]);
		}
		return this.makeMove(minimax(this.board, this.#n, this.#turn)[1]);
	}
}
