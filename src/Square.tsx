import "./App.css";
import { FC } from "react";
import { Mark } from "./game";
import { ReactComponent as X } from "./x-solid.svg";
import { ReactComponent as O } from "./o-solid.svg";

export interface SquareProps {
	mark: Mark;
	makeMove: () => void;
}

export const Square: FC<SquareProps> = (props) => {
	return (
		<div className="square" onClick={props.makeMove}>
			{props.mark === Mark.X ? (
				<X width="32px" height="32px" fill="#31c4be" />
			) : props.mark === Mark.O ? (
				<O width="32px" height="32px" fill="#f2b237" />
			) : null}
		</div>
	);
};
