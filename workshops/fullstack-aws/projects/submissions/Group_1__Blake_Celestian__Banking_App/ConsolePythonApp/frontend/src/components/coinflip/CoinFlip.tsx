import { useState } from "react";
import bombIcon from "../../assets/bomb.svg";
import moneyBagIcon from "../../assets/money_bag.svg";

export interface CoinFlipProps {
	/** Amount that is at stake for this transaction. */
	amount: number;
	currency?: string;
	onComplete?: (amount: number, won: boolean) => void | boolean | Promise<boolean>;
	initialResult?: boolean | null;
	disabled?: boolean;
}

/** A small, self-contained free-or-double control for transaction rows. */
export default function CoinFlip({
	amount,
	currency = "USD",
	onComplete,
	initialResult = null,
	disabled = false,
}: CoinFlipProps) {
	const [flipping, setFlipping] = useState(false);
	const [result, setResult] = useState<boolean | null>(initialResult);
	const [didFlip, setDidFlip] = useState(false);
	const [error, setError] = useState(false);
	const completed = result !== null;

	const flip = () => {
		if (flipping || disabled || completed) return;

		setFlipping(true);
		setError(false);

		window.setTimeout(async () => {
			try {
				const completedResult = await onComplete?.(amount, false);
				if (typeof completedResult === "boolean") setResult(completedResult);
			} catch {
				setError(true);
			} finally {
				setDidFlip(true);
				setFlipping(false);
			}
		}, 700);
	};

	const formattedAmount = new Intl.NumberFormat(undefined, {
		style: "currency",
		currency,
	}).format(amount);

	const coinClass = [
		"coin",
		flipping ? "is-flipping" : "",
		didFlip ? "did-flip" : "",
		result === true ? "is-revealed is-free" : "",
		result === false ? "is-revealed is-double" : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className="coin-flip">
			<button
				type="button"
				className={coinClass}
				aria-label={
					completed
						? result
							? "Wager result: free"
							: "Wager result: double"
						: `Flip coin to make ${formattedAmount} free or double`
				}
				aria-busy={flipping}
				disabled={disabled || flipping || completed}
				onClick={flip}
			>
				<span className="coin-inner">
					<span className="coin-face coin-front">?</span>
					<span className={`coin-face coin-back ${result === true ? "is-free" : result === false ? "is-double" : ""}`}>
						{result === true ? (
							<img className="coin-icon" src={moneyBagIcon} alt="" />
						) : result === false ? (
							<img className="coin-icon" src={bombIcon} alt="" />
						) : (
							"?"
						)}
					</span>
				</span>
			</button>
			<div className="visually-hidden" aria-live="polite">
				{error && "Wager could not be completed."}
				{!error && flipping && "Flipping"}
				{!error && result === true && "Free"}
				{!error && result === false && "Doubled"}
			</div>
			{error && <div className="coin-status">Could not complete</div>}
		</div>
	);
}
