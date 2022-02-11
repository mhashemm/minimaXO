import { Board, checkAllRowsAndCols, checkDiagonal, getAvailableMoves, isDraw, Mark } from "./game";

const isTurnWinner = (board: Board, n: number, turn: Mark): boolean =>
	checkDiagonal(board, n, turn) || checkAllRowsAndCols(board, n, turn);

const less = (a: number, b: number) => a < b;
const greater = (a: number, b: number) => a > b;

export const minimax = (
	board: Board,
	n: number,
	turn: Mark,
	alpha: number = Number.MIN_SAFE_INTEGER,
	beta: number = Number.MAX_SAFE_INTEGER,
	depth: number = 0
): [bestScore: number, bestMove: number] => {
	if (isTurnWinner(board, n, Mark.X)) return [1000 - depth, -1];
	if (isTurnWinner(board, n, Mark.O)) return [depth - 1000, -1];
	if (isDraw(board)) return [0, -0];

	const maximizing = turn === Mark.X;
	const compare = maximizing ? greater : less;
	let bestScore = maximizing ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER,
		bestMove = -1;
	const moves = getAvailableMoves(board);
	for (const move of moves) {
		board[move] = turn;
		const [score] = minimax(board, n, turn === Mark.X ? Mark.O : Mark.X, alpha, beta, depth + 1);
		board[move] = Mark.Empty;
		bestMove = compare(score, bestScore) ? move : bestMove;
		bestScore = compare(score, bestScore) ? score : bestScore;
		alpha = maximizing ? Math.max(score, alpha) : alpha;
		beta = maximizing ? beta : Math.min(score, beta);
		if (beta <= alpha) break;
	}
	return [bestScore, bestMove];
};
